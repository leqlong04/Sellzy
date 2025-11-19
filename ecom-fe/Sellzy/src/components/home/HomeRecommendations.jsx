import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductRecommendations from "../products/ProductRecommendations";
import { fetchUserRecommendations } from "../../api/products";
import { Link } from "react-router-dom";

const HomeRecommendations = () => {
  const { user } = useSelector((state) => state.auth);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fallback, setFallback] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!user) {
      return;
    }

    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchUserRecommendations(8);
        if (!active) {
          return;
        }
        setItems(data.recommendations || []);
        setFallback(Boolean(data.fallback));
      } catch (err) {
        if (!active) {
          return;
        }
        setError(err?.response?.data?.message || "Unable to load suggestions");
        setItems([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [user?.userId, version]);

  const handleRefresh = () => setVersion((prev) => prev + 1);

  if (!user) {
    return (
      <section className="py-20 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm px-6 py-10 text-center space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">
              Sign in to get personalized picks
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto">
              We use your recent activity to surface items you’re likely to love.
              Log in and keep shopping to unlock tailored recommendations.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-500 transition-colors"
            >
              Sign in to view recommendations
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductRecommendations
          items={items}
          loading={loading}
          error={error}
          fallback={fallback}
          onRetry={handleRefresh}
          title="Recommended for you"
          subtitle="Curated using your purchases and browsing history"
          emptyMessage="Keep shopping to unlock personalized recommendations."
        />
      </div>
    </section>
  );
};

export default HomeRecommendations;

