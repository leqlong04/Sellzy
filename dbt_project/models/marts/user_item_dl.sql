{{ config(materialized='table') }}

select distinct
    user_id,
    product_id,
    product_name
from {{ ref('stg_order_items') }}

