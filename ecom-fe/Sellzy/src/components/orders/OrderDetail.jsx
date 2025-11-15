import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchOrderDetail, cancelOrder } from "../../api/profile";
import { submitProductReview } from "../../api/products";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [currentReviewItem, setCurrentReviewItem] = useState(null);
  const [reviewPayload, setReviewPayload] = useState({
    orderItemId: "",
    rating: 5,
    title: "",
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadOrder = async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }
    try {
      const data = await fetchOrderDetail(orderId);
      setOrder(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load order detail");
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadOrder(true);
  }, [orderId]);

  const handleCancel = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      const updated = await cancelOrder(order.orderId);
      setOrder(updated);
      toast.success("Order cancelled");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Unable to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const handleOpenReview = (item) => {
    setCurrentReviewItem(item);
    setReviewPayload({
      orderItemId: item.orderItemId,
      rating: 5,
      title: "",
      comment: "",
    });
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setSubmittingReview(false);
    setCurrentReviewItem(null);
    setReviewPayload({
      orderItemId: "",
      rating: 5,
      title: "",
      comment: "",
    });
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    if (!reviewPayload.orderItemId) {
      toast.error("Missing order item information");
      return;
    }
    setSubmittingReview(true);
    try {
      await submitProductReview({
        orderItemId: Number(reviewPayload.orderItemId),
        rating: Number(reviewPayload.rating),
        title: reviewPayload.title,
        comment: reviewPayload.comment,
      });
      toast.success("Review submitted");
      closeReviewModal();
      await loadOrder(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Unable to submit review");
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
        Loading order detail...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
        Order not found.
      </div>
    );
  }

  const isPending =
    order.orderStatus && order.orderStatus.toUpperCase() === "PENDING";
  const isDelivered =
    order.orderStatus && order.orderStatus.toUpperCase() === "DELIVERED";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <Link to="/profile/orders" className="text-sm text-blue-600">
        ← Back to order history
      </Link>

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Order #{order.orderId}
            </h1>
            <p className="text-sm text-slate-500">
              Placed on:{" "}
              {order.placedAt
                ? new Date(order.placedAt).toLocaleString()
                : "—"}
            </p>
          </div>
          <span className="px-4 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700">
            {order.orderStatus}
          </span>
        </div>

        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Unit price
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Review
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {order.items?.map((item) => (
                <tr key={`${item.productId}-${item.productName}`}>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {item.productName}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    $
                    {Number(item.unitPrice).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-rose-500">
                    -
                    {Number(item.discount || 0).toFixed(0)}%
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-slate-800">
                    $
                    {Number(item.lineTotal).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {item.reviewSubmitted ? (
                      <div className="text-right">
                        {item.reviewRating ? (
                          <div className="text-amber-500 text-base font-semibold">
                            {"★".repeat(item.reviewRating)}
                            {"☆".repeat(5 - item.reviewRating)}
                          </div>
                        ) : (
                          <span className="text-slate-500">Reviewed</span>
                        )}
                        {item.reviewComment && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            “{item.reviewComment}”
                          </p>
                        )}
                      </div>
                    ) : item.canReview ? (
                      <button
                        onClick={() => handleOpenReview(item)}
                        className="inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-blue-200 text-blue-600 text-xs font-semibold hover:bg-blue-50 transition"
                      >
                        Write review
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">
                        {isDelivered
                          ? "Already reviewed"
                          : "Available after delivery"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase">
              Shipping address
            </h3>
            {order.shippingAddress ? (
              <div className="text-sm text-slate-600 mt-1">
                <p>{order.shippingAddress.buildingName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p>
                  {order.shippingAddress.country},{" "}
                  {order.shippingAddress.pincode}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No information available.</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 uppercase">Order total</p>
            <p className="text-2xl font-semibold text-slate-900">
              $
              {Number(order.totalAmount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {isPending && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="px-5 py-2 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-400 disabled:opacity-60"
          >
            {cancelling ? "Cancelling..." : "Cancel order"}
          </button>
        )}
      </section>

      {reviewModalOpen && currentReviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Write a review
                </h3>
                <p className="text-xs text-slate-500">
                  {currentReviewItem.productName}
                </p>
              </div>
              <button
                onClick={closeReviewModal}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmitReview}>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Rating
                </label>
                <select
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reviewPayload.rating}
                  onChange={(event) =>
                    setReviewPayload((prev) => ({
                      ...prev,
                      rating: event.target.value,
                    }))
                  }
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} star{value > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Title (optional)
                </label>
                <input
                  type="text"
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reviewPayload.title}
                  onChange={(event) =>
                    setReviewPayload((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Comment (optional)
                </label>
                <textarea
                  rows={4}
                  className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reviewPayload.comment}
                  onChange={(event) =>
                    setReviewPayload((prev) => ({
                      ...prev,
                      comment: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeReviewModal}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-full hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-500 transition disabled:opacity-60"
                >
                  {submittingReview ? "Submitting..." : "Submit review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;

