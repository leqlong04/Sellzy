import argparse
from pathlib import Path
from typing import List

import pandas as pd
from mlxtend.frequent_patterns import association_rules, fpgrowth
from mlxtend.preprocessing import TransactionEncoder


def normalize_item(token: str) -> str:
    return str(token).strip().lower()


def load_transactions(csv_path: Path) -> List[List[str]]:
    if not csv_path.exists():
        raise FileNotFoundError(f"Cannot find {csv_path}")

    frame = pd.read_csv(csv_path)
    if "items" not in frame.columns:
        raise ValueError("transaction_fpgrowth.csv must contain an 'items' column")

    transactions: List[List[str]] = []
    for raw in frame["items"].fillna(""):
        tokens = [normalize_item(part) for part in str(raw).split(",") if part.strip()]
        # drop duplicates in-place but keep order
        deduped = list(dict.fromkeys(tokens))
        if deduped:
            transactions.append(deduped)

    if not transactions:
        raise ValueError("No valid transactions found in dataset")

    return transactions


def generate_rules(transactions: List[List[str]], min_support: float, min_conf: float) -> pd.DataFrame:
    encoder = TransactionEncoder()
    matrix = encoder.fit(transactions).transform(transactions)
    df_encoded = pd.DataFrame(matrix, columns=encoder.columns_)

    freq_itemsets = fpgrowth(df_encoded, min_support=min_support, use_colnames=True)
    if freq_itemsets.empty:
        raise ValueError("FP-Growth returned zero frequent itemsets. Lower min_support.")

    rules = association_rules(freq_itemsets, metric="confidence", min_threshold=min_conf)
    rules = rules[rules["consequents"].apply(lambda x: len(x) == 1)]
    if rules.empty:
        raise ValueError("Association rules filtering produced zero rows. Lower thresholds.")

    def format_set(items):
        return sorted(items)

    def single_item(items):
        return sorted(items)[0] if items else ""

    tidy = pd.DataFrame(
        {
            "antecedent": rules["antecedents"].apply(format_set),
            "consequent": rules["consequents"].apply(single_item),
            "support": rules["support"].round(6),
            "confidence": rules["confidence"].round(6),
            "lift": rules["lift"].round(6),
        }
    ).sort_values(["confidence", "lift"], ascending=False, ignore_index=True)

    return tidy


def main():
    parser = argparse.ArgumentParser(description="Build FP-Growth association rules for the AI recommender")
    parser.add_argument(
        "--input",
        type=Path,
        default=Path("../data/transaction_fpgrowth.csv"),
        help="Path to transaction_fpgrowth.csv exported from dbt (default: ../data/transaction_fpgrowth.csv)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("../data/rules.csv"),
        help="Where to write the rules.csv file (default: ../data/rules.csv)",
    )
    parser.add_argument("--min-support", type=float, default=0.01, help="Minimum support for FP-Growth")
    parser.add_argument("--min-confidence", type=float, default=0.2, help="Minimum confidence for association rules")
    args = parser.parse_args()

    transactions = load_transactions(args.input.resolve())
    tidy_rules = generate_rules(transactions, args.min_support, args.min_confidence)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    tidy_rules.to_csv(args.output, index=False)
    print(f"Generated {len(tidy_rules)} rules -> {args.output.resolve()}")


if __name__ == "__main__":
    main()

