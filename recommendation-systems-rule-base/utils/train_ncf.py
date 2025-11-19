import argparse
import random
import sys
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Set, Tuple

import numpy as np
import pandas as pd
import torch
from torch.utils.data import DataLoader, Dataset

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.recommender_dl import NCF  # pylint: disable=wrong-import-position


class InteractionDataset(Dataset):
    def __init__(self, samples: List[Tuple[int, int, float]]):
        self.users = torch.tensor([s[0] for s in samples], dtype=torch.long)
        self.items = torch.tensor([s[1] for s in samples], dtype=torch.long)
        self.labels = torch.tensor([s[2] for s in samples], dtype=torch.float32)

    def __len__(self) -> int:
        return len(self.labels)

    def __getitem__(self, idx: int):
        return self.users[idx], self.items[idx], self.labels[idx]


def set_seed(seed: int):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


def prepare_interactions(frame: pd.DataFrame) -> Tuple[Dict[int, int], Dict[str, int], Dict[int, Set[int]]]:
    required_cols = {"user_id", "product_id", "product_name"}
    missing = required_cols - set(frame.columns)
    if missing:
        raise ValueError(f"user_item_dl.csv missing columns: {', '.join(sorted(missing))}")

    df = frame.dropna(subset=["user_id"]).copy()
    df["user_id"] = df["user_id"].astype(int)

    df["item_key"] = (
        df["product_name"]
        .fillna("")
        .astype(str)
        .str.strip()
        .str.lower()
    )
    empty_mask = df["item_key"] == ""
    if empty_mask.any():
        df.loc[empty_mask, "item_key"] = (
            df.loc[empty_mask, "product_id"]
            .astype(str)
            .str.strip()
        )
    df = df[df["item_key"] != ""]

    if df.empty:
        raise ValueError("user_item_dl.csv has no usable rows (missing product_name/product_id)")

    user_ids = sorted(df["user_id"].unique())
    item_keys = sorted(df["item_key"].unique())
    if len(user_ids) < 2 or len(item_keys) < 2:
        raise ValueError("Need at least 2 users and 2 items to train NCF")

    user2idx = {uid: idx for idx, uid in enumerate(user_ids)}
    item2idx = {name: idx for idx, name in enumerate(item_keys)}

    interactions: Dict[int, Set[int]] = defaultdict(set)
    for row in df.itertuples():
        interactions[user2idx[row.user_id]].add(item2idx[row.item_key])

    return user2idx, item2idx, interactions


def build_samples(
    interactions: Dict[int, Set[int]],
    num_items: int,
    negatives: int,
    seed: int,
) -> List[Tuple[int, int, float]]:
    rng = random.Random(seed)
    all_items = list(range(num_items))
    samples: List[Tuple[int, int, float]] = []

    for user, positives in interactions.items():
        if not positives:
            continue
        positives_list = list(positives)
        for pos in positives_list:
            samples.append((user, pos, 1.0))
            need = negatives
            attempts = 0
            seen: Set[int] = set()
            while need > 0 and attempts < num_items * 3:
                candidate = rng.choice(all_items)
                attempts += 1
                if candidate in positives or candidate in seen:
                    continue
                seen.add(candidate)
                samples.append((user, candidate, 0.0))
                need -= 1

    if not samples:
        raise ValueError("Unable to build training samples. Check input data.")

    rng.shuffle(samples)
    return samples


def train_model(
    samples: List[Tuple[int, int, float]],
    n_users: int,
    n_items: int,
    embedding_size: int,
    batch_size: int,
    epochs: int,
    lr: float,
    weight_decay: float,
):
    dataset = InteractionDataset(samples)
    loader = DataLoader(dataset, batch_size=batch_size, shuffle=True, drop_last=False)

    model = NCF(n_users, n_items, emb_size=embedding_size)
    criterion = torch.nn.BCELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=weight_decay)

    for epoch in range(epochs):
        running_loss = 0.0
        for users, items, labels in loader:
            preds = model(users, items)
            loss = criterion(preds, labels)
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            running_loss += loss.item() * len(labels)

        epoch_loss = running_loss / len(dataset)
        print(f"Epoch {epoch + 1}/{epochs} - loss={epoch_loss:.4f}")

    return model


def main():
    parser = argparse.ArgumentParser(description="Train the NCF model used by the hybrid recommendation service")
    parser.add_argument(
        "--data",
        type=Path,
        default=Path("../data/user_item_dl.csv"),
        help="Path to the user_item_dl.csv export (default: ../data/user_item_dl.csv)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("../models/ncf_model.pt"),
        help="Where to store the trained checkpoint (default: ../models/ncf_model.pt)",
    )
    parser.add_argument("--epochs", type=int, default=5)
    parser.add_argument("--batch-size", type=int, default=1024)
    parser.add_argument("--embedding-size", type=int, default=64)
    parser.add_argument("--negatives", type=int, default=4, help="Negative samples per positive pair")
    parser.add_argument("--lr", type=float, default=1e-3)
    parser.add_argument("--weight-decay", type=float, default=1e-5)
    parser.add_argument("--seed", type=int, default=7)
    args = parser.parse_args()

    set_seed(args.seed)

    if not args.data.exists():
        raise FileNotFoundError(f"{args.data} not found. Run utils/export_data.py first.")

    frame = pd.read_csv(args.data)
    user2idx, item2idx, interactions = prepare_interactions(frame)
    samples = build_samples(interactions, len(item2idx), args.negatives, args.seed)

    model = train_model(
        samples,
        n_users=len(user2idx),
        n_items=len(item2idx),
        embedding_size=args.embedding_size,
        batch_size=args.batch_size,
        epochs=args.epochs,
        lr=args.lr,
        weight_decay=args.weight_decay,
    )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    torch.save(
        {
            "model": model.state_dict(),
            "user2idx": user2idx,
            "item2idx": item2idx,
        },
        args.output,
    )
    print(f"Saved model to {args.output.resolve()}")


if __name__ == "__main__":
    main()

