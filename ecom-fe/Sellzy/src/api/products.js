import api from "./api";

export const fetchProductDetail = async (productId) => {
  const { data } = await api.get(`/public/products/${productId}`);
  return data;
};

export const fetchProductReviews = async (productId, params = {}) => {
  const { data } = await api.get(`/public/products/${productId}/reviews`, {
    params,
  });
  return data;
};

export const fetchProductRecommendations = async (productId, top = 6) => {
  const { data } = await api.get(
    `/public/recommendations/products/${productId}`,
    {
      params: { top },
    }
  );
  return data;
};

export const fetchUserRecommendations = async (top = 8) => {
  const { data } = await api.get("/user/recommendations", {
    params: { top },
  });
  return data;
};

export const fetchCategories = async (params = {}) => {
  const defaultParams = {
    pageNumber: 0,
    pageSize: 12,
    sortBy: "categoryName",
    sortOrder: "asc",
  };
  const { data } = await api.get("/public/categories", {
    params: { ...defaultParams, ...params },
  });
  return data;
};

export const fetchTrendingProducts = async (params = {}) => {
  const defaultParams = {
    pageNumber: 0,
    pageSize: 12,
    sortBy: "ratingCount",
    sortOrder: "desc",
  };
  const { data } = await api.get("/public/products", {
    params: { ...defaultParams, ...params },
  });
  return data;
};

export const submitProductReview = async (payload) => {
  const { data } = await api.post("/user/reviews", payload);
  return data;
};

