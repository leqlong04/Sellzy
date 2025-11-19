# dbt pipeline for sb-ecom recommendations

This lightweight dbt project builds the two mart tables that feed the AI recommendation service:

- `transaction_fpgrowth`: transaction-level baskets for FP-Growth
- `user_item_dl`: user/product interactions for the neural model

## Quick start

1. Copy `profiles.yml.example` to your local dbt profiles directory and update credentials:
   - Linux/macOS: `~/.dbt/profiles.yml`
   - Windows: `%USERPROFILE%\.dbt\profiles.yml`
2. Install deps: `pip install -r recommendation-systems-rule-base/requirements_dev.txt`
3. From this folder run:

```bash
dbt deps
dbt seed   # optional – there are no seeds yet
dbt run
dbt test   # optional but recommended
```

The resulting tables will be materialized in the `public` schema (override via profile).

## Exporting data to the AI service

After `dbt run`, execute:

```bash
python ../utils/export_data.py
```

The script copies the mart tables to `recommendation-systems-rule-base/data/`. From there you can generate FP rules and retrain the NCF model using the helper scripts inside `recommendation-systems-rule-base/utils`.

