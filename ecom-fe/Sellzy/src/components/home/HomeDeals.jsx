import ProductRecommendations from "../products/ProductRecommendations";

const HomeDeals = ({ items = [], loading, error, onRetry }) => {
  const normalized = items.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    image: item.image,
    price:
      item.specialPrice !== null && item.specialPrice !== undefined
        ? item.specialPrice
        : item.price,
    score:
      item.discount !== null && item.discount !== undefined
        ? item.discount / 100
        : null,
  }));

  if (!loading && !normalized.length && !error) {
    return null;
  }

  return (
    <section className="py-20 bg-white/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductRecommendations
          items={normalized}
          loading={loading}
          error={error}
          fallback={false}
          onRetry={onRetry}
          retryLabel="Reload deals"
          title="Top deals this week"
          subtitle="Hand-picked offers with high customer ratings"
          emptyMessage="Fresh deals are coming soon."
        />
      </div>
    </section>
  );
};

export default HomeDeals;

