import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { cancelOrder, fetchUserOrders } from "../../api/profile";

const statusBadgeClasses = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-600",
  DELIVERED: "bg-green-100 text-green-700",
  PROCESSING: "bg-blue-100 text-blue-600",
  SHIPPED: "bg-purple-100 text-purple-600",
};

const OrderHistory = () => {
  const [page, setPage] = useState(0);
  const [orders, setOrders] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const loadOrders = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const data = await fetchUserOrders({ page: pageNumber, size: 10 });
      setOrders(data.content || []);
      setPageInfo({
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
      setPage(pageNumber);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(0);
  }, []);

  const handleCancel = async (orderId) => {
    setCancellingId(orderId);
    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled");
      loadOrders(page);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Unable to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">
        Order history
      </h1>

      {loading ? (
        <div className="text-slate-500">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-slate-500">
          You don't have any orders yet. Start shopping now!
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const badgeClass =
              statusBadgeClasses[order.orderStatus?.toUpperCase()] ||
              "bg-slate-100 text-slate-600";
            const isPending =
              order.orderStatus &&
              order.orderStatus.toUpperCase() === "PENDING";
            return (
              <div
                key={order.orderId}
                className="border border-slate-200 rounded-2xl bg-white shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <p className="text-sm text-slate-500">
                    Order #: {order.orderId}
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    Total: $
                    {Number(order.totalAmount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-sm text-slate-500">
                    Placed on:{" "}
                    {order.placedAt
                      ? new Date(order.placedAt).toLocaleString()
                      : "—"}
                  </p>
                  <span
                    className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to={`/profile/orders/${order.orderId}`}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    View details
                  </Link>
                  <button
                    onClick={() => handleCancel(order.orderId)}
                    disabled={!isPending || cancellingId === order.orderId}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-rose-500 text-white hover:bg-rose-400 disabled:opacity-60"
                  >
                    {cancellingId === order.orderId
                      ? "Cancelling..."
                      : "Cancel order"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pageInfo.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => loadOrders(page - 1)}
            disabled={page === 0}
            className="px-3 py-1 rounded border border-slate-300 text-sm text-slate-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">
            Page {page + 1} / {pageInfo.totalPages}
          </span>
          <button
            onClick={() => loadOrders(page + 1)}
            disabled={page + 1 >= pageInfo.totalPages}
            className="px-3 py-1 rounded border border-slate-300 text-sm text-slate-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

