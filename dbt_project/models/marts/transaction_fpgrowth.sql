{{ config(materialized='table') }}

select
    order_id as transaction_id,
    string_agg(distinct product_name, ',' order by product_name) as items
from {{ ref('stg_order_items') }}
group by order_id

