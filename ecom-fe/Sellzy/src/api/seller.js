import api from "./api";

export const fetchSellerProfile = async (sellerId, featuredProducts = 6) => {
  const response = await api.get(`/public/sellers/${sellerId}`, {
    params: { featuredProducts },
  });
  return response.data;
};

export const fetchSellerProducts = async (sellerId, page = 0, size = 12) => {
  const response = await api.get(`/public/sellers/${sellerId}/products`, {
    params: { page, size },
  });
  return response.data;
};

export const fetchSellerStatistics = async () => {
  const response = await api.get("/seller/statistics");
  return response.data;
};
