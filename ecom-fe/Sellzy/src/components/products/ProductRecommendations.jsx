import { Link } from "react-router-dom";
import getImageUrl from "../../utils/getImageUrl";

const RecommendationCard = ({ item }) => {
  const content = (
    <div className="min-w-[180px] max-w-[200px] bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 hover:border-slate-300 transition">
      <div className="h-32 flex items-center justify-center bg-white rounded-xl overflow-hidden">
        <img
          src={item.image ? getImageUrl(item.image) : "/placeholder.svg"}
          alt={item.productName || item.item}
          className="max-h-full w-auto object-contain"
          onError={(event) => {
            event.currentTarget.src = "/placeholder.svg";
          }}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800 line-clamp-2">
          {item.productName || item.item}
        </p>
        {item.price !== null && item.price !== undefined && (
          <p className="text-sm font-bold text-slate-900">
            ${Number(item.price).toFixed(2)}
          </p>
        )}
        {item.score !== null && item.score !== undefined && (
          <p className="text-xs text-slate-500">
            Confidence {(item.score * 100).toFixed(0)}%
          </p>
        )}
      </div>
    </div>
  );

  if (item.productId) {
    return (
      <Link to={`/products/${item.productId}`} className="focus:outline-none">
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
};

const ProductRecommendations = ({
  items,
  loading,
  error,
  onRetry,
  retryLabel = "Refresh suggestions",
  fallback,
  title = "Frequently bought together",
  subtitle,
  emptyMessage = "No recommendations available for this product yet.",
  actions,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
          {fallback && (
            <p className="text-xs text-amber-600 mt-1">
              Showing fallback suggestions
            </p>
          )}
          {error && (
            <p className="text-xs text-rose-500 mt-1">
              Failed to load recommendations.
            </p>
          )}
        </div>
        {(onRetry || actions) && (
          <div className="flex items-center gap-3">
            {actions}
            {onRetry && (
              <button
                onClick={onRetry}
                className="self-start text-sm font-semibold text-blue-600 hover:text-blue-500"
              >
                {retryLabel}
              </button>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-48 bg-slate-100 rounded-2xl animate-pulse"
            ></div>
          ))}
        </div>
      ) : items && items.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {items.map((item, index) => (
            <RecommendationCard key={`${item.productId || index}-${index}`} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">{emptyMessage}</p>
      )}
    </div>
  );
};

export default ProductRecommendations;

