import os
import sys
from pathlib import Path

import pandas as pd
from sqlalchemy import create_engine

DB_CONFIG = {
    "host": os.getenv("ECOM_DB_HOST", "localhost"),
    "port": os.getenv("ECOM_DB_PORT", "5432"),
    "dbname": os.getenv("ECOM_DB_NAME", "ecommerce"),
    "user": os.getenv("ECOM_DB_USER", "postgres"),
    "password": os.getenv("ECOM_DB_PASSWORD", "lequanglong2012"),
}

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_OUTPUT_DIR = BASE_DIR.parent / "recommendation-systems-rule-base" / "data"
CUSTOM_OUTPUT = os.getenv("RECO_EXPORT_DIR")
if CUSTOM_OUTPUT:
    OUTPUT_DIR = Path(CUSTOM_OUTPUT).expanduser().resolve()
else:
    OUTPUT_DIR = DEFAULT_OUTPUT_DIR.resolve()
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

MODELS = ["transaction_fpgrowth", "user_item_dl"]


def export_models():
    conn_str = (
        f"postgresql+psycopg2://{DB_CONFIG['user']}:{DB_CONFIG['password']}"
        f"@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['dbname']}"
    )
    engine = create_engine(conn_str)
    print(f"Export destination: {OUTPUT_DIR}")

    for model in MODELS:
        print(f"Exporting {model}...")
        query = f'SELECT * FROM "{model}";'
        try:
            df = pd.read_sql(query, engine)
        except Exception as exc:
            print(f"Failed to export {model}: {exc}", file=sys.stderr)
            continue

        output_file = OUTPUT_DIR / f"{model}.csv"
        df.to_csv(output_file, index=False)
        print(f"Saved to {output_file}")


if __name__ == "__main__":
    export_models()

