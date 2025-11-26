# Pj1 – SB E‑Commerce + AI Recommendations

This workspace bundles three projects that work together:

| Directory | Description |
|-----------|-------------|
| `sb-ecom/` | Spring Boot 3.5 backend (PostgreSQL, MongoDB chat, Stripe) exposing REST APIs. |
| `ecom-fe/Sellzy/` | React + Vite frontend that consumes the backend and surfaces the AI recommendations. |
| `recommendation-systems-rule-base/` | FastAPI service plus dbt + Python tooling for FP-Growth rules and NCF (user-based) recommender. |

The steps below are the shortest path for a teammate to get everything running locally on Windows/macOS/Linux.

---

## 1. Prerequisites

- **JDK 21** (for Spring Boot)  
- **Node.js 18+** and npm (for the Vite frontend)  
- **Python 3.10+** + `pip` (for the AI service & dbt)  
- **PostgreSQL 15+** running locally on `localhost:5432` with database `ecommerce` (credentials align with `sb-ecom/src/main/resources/application.properties`)  

Optional but recommended:
- **MongoDB Atlas** (only if you want the chat module; otherwise update `application.properties`)
- **Stripe test key** for checkout

---

## 2. Backend (sb-ecom)

```powershell
cd sb-ecom
.\mvnw spring-boot:run
```

Default ports & credentials are already set:

| Purpose        | Value                                    |
|----------------|------------------------------------------|
| API base       | `http://localhost:8080/api`              |
| PostgreSQL URL | `jdbc:postgresql://localhost:5432/ecommerce` |
| DB user / pass | `postgres / lequanglong2012`             |
| Recommendation | `recommendation.base-url=http://127.0.0.1:8000` |

> Ensure the tables have data (users, products, orders). The dbt section below explains how to seed recommendation data.

---

## 3. Frontend (ecom-fe/Sellzy)

```powershell
cd ecom-fe/Sellzy
npm install
npm run dev
```

- Vite dev server: `http://localhost:5173`
- The frontend automatically targets the backend via `VITE_BACK_END_URL` (defaults to `http://localhost:8080`).

---

## 4. AI Recommendation Service

1. **Install dependencies (once)**
   ```powershell
   cd recommendation-systems-rule-base
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r requirements_dev.txt
   ```

2. **Generate training data from sb-ecom DB**
   ```powershell
   cd E:\Pj1\dbt_project
   (.venv) dbt deps
   (.venv) dbt run

   cd E:\Pj1
   (.venv) python utils/export_data.py
   ```

3. **Build FP-Growth rules & train NCF**
   ```powershell
   cd recommendation-systems-rule-base/utils
   (.venv) python build_rules.py --min-support 0.01 --min-confidence 0.2
   (.venv) python train_ncf.py --epochs 6 --batch-size 1024
   ```

4. **Run FastAPI**
   ```powershell
 PS E:\Pj1>    .\.venv\Scripts\activate
(.venv) PS E:\Pj1> cd recommendation-systems-rule-base  
(.venv) PS E:\Pj1\recommendation-systems-rule-base>    uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
   ```

   - Swagger docs: `http://127.0.0.1:8000/docs`
   - Health check: `GET /health`

The Spring Boot app uses `RestTemplate` to call:

| Endpoint                                | Purpose                         |
|-----------------------------------------|---------------------------------|
| `GET /recommend/by-item?item=...`       | FP-Growth (product-based)       |
| `GET /recommend/by-user?user_id=...`    | NCF (user-based)                |

---

## 5. Typical Workflow

1. Start PostgreSQL; ensure `ecommerce` DB exists.
2. Run `sb-ecom` (backend).
3. Run `recommendation-systems-rule-base` FastAPI (needs latest `rules.csv` and `ncf_model.pt`).
4. Start the frontend (`npm run dev`).
5. (Optional) Re-run dbt + export whenever new orders land.

---

## 6. Useful Commands

| Purpose                             | Command |
|-------------------------------------|---------|
| Run backend tests                   | `cd sb-ecom && .\mvnw test` |
| Build optimized frontend            | `cd ecom-fe/Sellzy && npm run build` |
| Export recommendation CSVs only     | `python utils/export_data.py` |
| Rebuild FP rules with different K   | `python build_rules.py --min-support 0.02 --min-confidence 0.3` |
| Retrain NCF quickly                 | `python train_ncf.py --epochs 3 --batch-size 2048` |

---

## 7. Tips

- The frontend caches “recently viewed” products in `localStorage`; opening a few product detail pages helps populate the home page rails.
- Ensure FastAPI is reachable before hitting `/api/public/recommendations/...` from the backend—otherwise you’ll see `fallback=true`.
- Keep an eye on `recommendation-systems-rule-base/logs/api.log` for API diagnostics.

