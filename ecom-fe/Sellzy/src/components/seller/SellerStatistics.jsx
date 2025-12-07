import { useEffect, useState } from "react";
import { fetchSellerStatistics } from "../../api/seller";
import toast from "react-hot-toast";

const SellerStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const data = await fetchSellerStatistics();
        setStatistics(data);
      } catch (error) {
        console.error("Failed to fetch seller statistics", error);
        toast.error("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-500">
        No statistics available
      </div>
    );
  }

  const hasStateTax = statistics.totalRevenue > 4000;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Sales Statistics</h1>
        <p className="text-slate-600 mt-2">Overview of your sales and revenue</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="text-sm text-slate-600 mb-1">Total Products Sold</div>
          <div className="text-3xl font-bold text-slate-900">
            {statistics.totalProductsSold?.toLocaleString() || 0}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="text-sm text-slate-600 mb-1">Total Orders</div>
          <div className="text-3xl font-bold text-slate-900">
            {statistics.totalOrders || 0}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm md:col-span-2">
          <div className="text-sm text-slate-600 mb-1">Total Revenue (Before Fees)</div>
          <div className="text-3xl font-bold text-slate-900">
            ${(statistics.totalRevenue || 0).toFixed(2)}
          </div>
        </div>

        <div className="bg-white border border-purple-200 rounded-xl p-6 shadow-sm bg-purple-50">
          <div className="text-sm text-purple-700 mb-1">Platform Fee (5%)</div>
          <div className="text-3xl font-bold text-purple-700">
            ${(statistics.totalPlatformFee || 0).toFixed(2)}
          </div>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-6 shadow-sm bg-amber-50">
          <div className="text-sm text-amber-700 mb-1">
            State Tax (7%)
            {!hasStateTax && <span className="ml-2 text-xs">(Not applicable)</span>}
          </div>
          <div className="text-3xl font-bold text-amber-700">
            ${(statistics.totalStateTax || 0).toFixed(2)}
          </div>
          {!hasStateTax && (
            <div className="text-xs text-amber-600 mt-2">
              Tax applies when revenue exceeds $4,000
            </div>
          )}
        </div>

        <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm bg-green-50 md:col-span-2">
          <div className="text-sm text-green-700 mb-1">Net Revenue (After All Fees)</div>
          <div className="text-4xl font-bold text-green-700">
            ${(statistics.totalRevenueAfterFees || 0).toFixed(2)}
          </div>
          <div className="text-xs text-green-600 mt-2">
            This is the amount you will receive after platform fee and tax deduction
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      {statistics.topSellingProducts && statistics.topSellingProducts.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Top Selling Products
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Product Name
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                    Quantity Sold
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                    Revenue
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-purple-700">
                    Platform Fee
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-amber-700">
                    State Tax
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-green-700">
                    Net Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {statistics.topSellingProducts.map((product) => (
                  <tr key={product.productId} className="border-b border-slate-100">
                    <td className="py-3 px-4 text-sm text-slate-800">
                      {product.productName}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-600">
                      {product.quantitySold?.toLocaleString() || 0}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-slate-600">
                      ${(product.revenue || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-purple-600">
                      ${(product.platformFee || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-amber-600">
                      ${(product.stateTax || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-green-700">
                      ${(product.revenueAfterFees || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Monthly Revenue */}
      {statistics.monthlyRevenue && statistics.monthlyRevenue.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Monthly Revenue (Last 12 Months)
          </h2>
          <div className="space-y-3">
            {statistics.monthlyRevenue.map((month) => (
              <div
                key={month.month}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div>
                  <div className="font-semibold text-slate-900">
                    {new Date(month.year, month.monthNumber - 1).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-slate-500">
                    {month.orderCount} order{month.orderCount !== 1 ? "s" : ""}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600">
                    Revenue: <span className="font-semibold">${(month.revenue || 0).toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-purple-600">
                    Platform Fee: ${(month.platformFee || 0).toFixed(2)}
                  </div>
                  <div className="text-xs text-amber-600">
                    State Tax: ${(month.stateTax || 0).toFixed(2)}
                  </div>
                  <div className="text-sm font-semibold text-green-700 mt-1">
                    Net: ${(month.revenueAfterFees || 0).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerStatistics;
