import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchSellerProfile, fetchSellerProducts } from "../../api/seller";
import ProductCard from "../shared/ProductCard";
import { useChat } from "../../context/ChatContext.jsx";

const SellerProfile = () => {
  const { sellerId } = useParams();
  const numericSellerId = Number(sellerId);
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const { startConversationWithSeller, isAuthenticated, setWidgetOpen } = useChat();

  useEffect(() => {
    const loadProfile = async () => {
      if (!numericSellerId) return;
      setLoadingProfile(true);
      try {
        const data = await fetchSellerProfile(numericSellerId);
        setProfile(data);
        setProducts(data.featuredProducts || []);
      } catch (error) {
        console.error("Failed to fetch seller profile", error);
        toast.error("Failed to load seller profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [numericSellerId]);

  const loadMoreProducts = async () => {
    if (loadingProducts || !numericSellerId || !hasMore) return;
    setLoadingProducts(true);
    try {
      const nextPage = page + 1;
      const data = await fetchSellerProducts(numericSellerId, nextPage, 12);
      setProducts((prev) => [...prev, ...(data.items || [])]);
      setPage(data.page);
      setHasMore(!data.last);
    } catch (error) {
      console.error("Failed to fetch seller products", error);
      toast.error("Unable to load more products");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleMessageSeller = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to message the seller");
      return;
    }
    const conversation = await startConversationWithSeller(numericSellerId);
    if (conversation) {
      setWidgetOpen(true);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading seller profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-slate-500 text-sm">Seller not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 mt-10 overflow-hidden">
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400" />
            <div className="px-6 sm:px-10 relative -mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div className="flex gap-5 items-end">
                <div className="w-28 h-28 rounded-3xl border-4 border-white bg-slate-100 overflow-hidden shadow-lg">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-semibold text-slate-400">
                      {profile.displayName?.[0]?.toUpperCase() || "S"}
                    </div>
                  )}
                </div>
                <div className="pb-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {profile.displayName}
                  </h1>
                  {profile.headline && (
                    <p className="text-slate-500 text-sm mt-1">{profile.headline}</p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                      {profile.totalProducts} products
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full font-medium">
                      Avg. price {profile.averageProductPrice.toFixed(2)}$
                    </span>
                  </div>
                </div>
              </div>
              <div className="pb-4">
                <button
                  onClick={handleMessageSeller}
                  className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full transition-colors shadow-md"
                >
                  Message seller
                </button>
              </div>
            </div>
          </div>

          {profile.description && (
            <div className="px-6 sm:px-10 pb-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                About the seller
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {profile.description}
              </p>
            </div>
          )}
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Featured products
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center text-slate-500">
              This seller has no products yet.
            </div>
          ) : (
            <>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.productId} {...product} />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMoreProducts}
                    disabled={loadingProducts}
                    className="px-6 py-3 text-sm font-semibold text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors disabled:opacity-60"
                  >
                    {loadingProducts ? "Loading..." : "Load more products"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default SellerProfile;

