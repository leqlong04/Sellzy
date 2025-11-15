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

export const submitProductReview = async (payload) => {
  const { data } = await api.post("/user/reviews", payload);
  return data;
};

