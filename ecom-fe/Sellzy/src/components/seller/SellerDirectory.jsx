import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/api";

const SellerDirectory = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSellers = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/auth/sellers", {
          params: { pageNumber: 0 },
        });
        setSellers(data?.content || []);
      } catch (error) {
        console.error("Failed to load sellers", error);
        toast.error("Không thể tải danh sách nhà bán");
      } finally {
        setLoading(false);
      }
    };
    loadSellers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-slate-500 text-sm">Đang tải danh sách nhà bán...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Nhà bán hàng uy tín
        </h1>
        <p className="text-slate-500 text-sm sm:text-base">
          Khám phá danh sách nhà bán hàng và trò chuyện trực tiếp để được tư vấn.
        </p>
      </div>
      {sellers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center">
          <p className="text-slate-500 text-sm">
            Hiện chưa có nhà bán hàng nào trong hệ thống.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sellers.map((seller) => (
            <Link
              key={seller.userId}
              to={`/seller/${seller.userId}`}
              className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                  {seller.userName?.[0]?.toUpperCase() || "S"}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {seller.userName}
                  </h2>
                  <p className="text-xs text-slate-400">{seller.email}</p>
                </div>
              </div>
              {seller.sellerHeadline && (
                <p className="text-sm text-slate-600 line-clamp-2">
                  {seller.sellerHeadline}
                </p>
              )}
              <span className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold mt-4">
                Xem trang nhà bán
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerDirectory;

