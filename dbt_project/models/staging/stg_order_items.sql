{{ config(materialized='view') }}

with orders as (
    select
        order_id,
        user_id,
        coalesce(placed_at, order_date::timestamp) as ordered_at
    from {{ source('public', 'orders') }}
    where user_id is not null
),

order_lines as (
    select
        oi.order_id,
        oi.product_id,
        oi.quantity,
        oi.order_product_price,
        lower(trim(p.product_name)) as product_name
    from {{ source('public', 'order_items') }} as oi
    join {{ source('public', 'products') }} as p
        on p.product_id = oi.product_id
    where p.product_name is not null
)

select
    o.order_id,
    o.user_id,
    o.ordered_at,
    ol.product_id,
    ol.product_name,
    ol.quantity,
    ol.order_product_price
from orders o
join order_lines ol on ol.order_id = o.order_id
where ol.product_name <> ''

