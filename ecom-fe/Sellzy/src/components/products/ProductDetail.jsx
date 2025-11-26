import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchProductDetail,
  fetchProductReviews,
  fetchProductRecommendations,
} from "../../api/products";
import getImageUrl from "../../utils/getImageUrl";
import { addToCart } from "../../store/actions";
import ProductRecommendations from "./ProductRecommendations";

const ProductDetail = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [recommendationsError, setRecommendationsError] = useState(null);
  const [recommendationsFallback, setRecommendationsFallback] = useState(false);
  const [recommendationsVersion, setRecommendationsVersion] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchProductDetail(productId);
        setProduct(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load product detail");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart(
        {
          productId: product.productId,
          productName: product.productName,
          description: product.description,
          price: product.price,
          specialPrice: product.specialPrice,
          image: product.image,
          quantity: product.quantity,
        },
        1,
        toast
      )
    );
  };

  const [reviewsPage, setReviewsPage] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const loadReviews = async (page = 0) => {
    setReviewsLoading(true);
    try {
      const data = await fetchProductReviews(productId, { page, size: 5 });
      setReviewsPage(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reviews");
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    let active = true;
    const loadRecommendations = async () => {
      setRecommendationsLoading(true);
      setRecommendationsError(null);
      try {
        const data = await fetchProductRecommendations(productId);
        if (!active) return;
        setRecommendations(data.recommendations || []);
        setRecommendationsFallback(Boolean(data.fallback));
      } catch (error) {
        console.error(error);
        if (!active) return;
        setRecommendations([]);
        setRecommendationsError(
          error?.response?.data?.message || "Unable to load recommendations"
        );
      } finally {
        if (active) {
          setRecommendationsLoading(false);
        }
      }
    };
    loadRecommendations();
    return () => {
      active = false;
    };
  }, [productId, recommendationsVersion]);

  const handleRefreshRecommendations = () =>
    setRecommendationsVersion((prev) => prev + 1);

  useEffect(() => {
    if (!product) return;
    try {
      const entry = {
        productId: product.productId,
        productName: product.productName,
        image: product.image,
        price: Number(product.specialPrice || product.price),
      };
      const key = "recently_viewed_products";
      const existing = JSON.parse(localStorage.getItem(key) || "[]")
        .filter((item) => item.productId !== entry.productId);
      existing.unshift(entry);
      localStorage.setItem(key, JSON.stringify(existing.slice(0, 12)));
    } catch (storageError) {
      console.error("Failed to persist recently viewed products", storageError);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="h-96 bg-slate-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-6 bg-slate-200 rounded w-2/3"></div>
              <div className="h-6 bg-slate-200 rounded w-1/2"></div>
              <div className="h-32 bg-slate-200 rounded"></div>
              <div className="h-10 bg-slate-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-slate-500">
        Product not found.
      </div>
    );
  }

  const finalPrice = product.specialPrice || product.price;
  const hasDiscount = product.discount > 0;
  const unitsSold = product.unitsSold ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 flex items-center justify-center">
            <img
              src={getImageUrl(product.image)}
              alt={product.productName}
              className="max-h-[420px] w-auto object-contain"
              onError={(event) => {
                event.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-slate-500">
                {product.categoryName ? `Category: ${product.categoryName}` : ""}
              </p>
              <h1 className="text-3xl font-bold text-slate-900">
                {product.productName}
              </h1>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-slate-900">
                  ${Number(finalPrice).toFixed(2)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-slate-400 line-through">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <span className="text-sm font-semibold text-rose-500">
                      -{Number(product.discount).toFixed(0)}%
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>
                  {product.quantity > 0 ? "In stock" : "Out of stock"}
                </span>
                <span>•</span>
                <span>{product.quantity} available</span>
                <span>•</span>
                <span>{unitsSold} sold</span>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-800">
                Product description
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="bg-slate-100 rounded-2xl px-4 py-4 space-y-1">
              <p className="text-sm font-semibold text-slate-700">
                Seller information
              </p>
              <p className="text-sm text-slate-600">
                Sold by{" "}
                {product.sellerId ? (
                  <Link
                    to={`/seller/${product.sellerId}`}
                    className="text-blue-600 hover:text-blue-500 font-semibold"
                  >
                    {product.sellerName || "Unknown seller"}
                  </Link>
                ) : (
                  product.sellerName || "Unknown seller"
                )}
              </p>
              {product.sellerHeadline && (
                <p className="text-xs text-slate-500">{product.sellerHeadline}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold py-3 rounded-full transition-colors"
              >
                Add to Cart
              </button>
              <Link
                to={product.sellerId ? `/seller/${product.sellerId}` : "#"}
                className="flex-1 text-center border border-slate-200 rounded-full py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Visit shop
              </Link>
            </div>
          </div>
        </div>

        <ProductRecommendations
          items={recommendations}
          loading={recommendationsLoading}
          error={recommendationsError}
          fallback={recommendationsFallback}
          onRetry={handleRefreshRecommendations}
        />

        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-slate-900">
                {Number(product.averageRating || 0).toFixed(1)}
              </span>
              <div className="text-sm text-slate-500">
                {product.ratingCount} review
                {product.ratingCount === 1 ? "" : "s"}
              </div>
            </div>
          </div>

          {reviewsLoading ? (
            <div className="text-sm text-slate-500">Loading reviews...</div>
          ) : reviewsPage && reviewsPage.content.length > 0 ? (
            <div className="space-y-4">
              {reviewsPage.content.map((review) => (
                <div
                  key={review.reviewId}
                  className="border border-slate-200 rounded-2xl px-4 py-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-800">
                      {review.reviewerName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {review.verified ? "Verified purchase" : ""}
                    </div>
                  </div>
                  <div className="text-sm text-yellow-500">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                  {review.title && (
                    <div className="text-sm font-semibold text-slate-700">
                      {review.title}
                    </div>
                  )}
                  {review.comment && (
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => loadReviews(reviewsPage.number - 1)}
                  disabled={reviewsPage.first}
                  className="px-3 py-1 text-sm font-medium text-slate-600 border border-slate-200 rounded-full disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-500">
                  Page {reviewsPage.number + 1} / {reviewsPage.totalPages}
                </span>
                <button
                  onClick={() => loadReviews(reviewsPage.number + 1)}
                  disabled={reviewsPage.last}
                  className="px-3 py-1 text-sm font-medium text-slate-600 border border-slate-200 rounded-full disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500">
              No reviews yet. Reviews are available once you have received your
              order.
            </div>
          )}
          <p className="text-xs text-slate-500">
            To write a review, open your delivered order from{" "}
            <Link to="/profile/orders" className="text-blue-600 underline">
              Order history
            </Link>{" "}
            and review individual items there.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

