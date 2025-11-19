import { useEffect, useState } from "react";
import ProductRecommendations from "../products/ProductRecommendations";

const STORAGE_KEY = "recently_viewed_products";

const HomeRecentlyViewed = () => {
  const [items, setItems] = useState([]);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setItems(stored);
    } catch (error) {
      console.error("Failed to load recently viewed products", error);
      setItems([]);
    }
  }, [version]);

  const refresh = () => setVersion((prev) => prev + 1);

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setItems([]);
  };

  if (!items.length) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductRecommendations
          items={items}
          loading={false}
          error={null}
          fallback={false}
          onRetry={refresh}
          retryLabel="Reload history"
          actions={
            <button
              type="button"
              onClick={clearHistory}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Clear history
            </button>
          }
          title="Recently viewed"
          subtitle="Pick up where you left off"
          emptyMessage="View a few products to see them here."
        />
      </div>
    </section>
  );
};

export default HomeRecentlyViewed;

