import api from "./api";

export const fetchUserProfile = async () => {
  const { data } = await api.get("/user/profile");
  return data;
};

export const updateUserProfile = async (payload) => {
  const { data } = await api.put("/user/profile", payload);
  return data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/user/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const fetchUserOrders = async ({ page = 0, size = 10 } = {}) => {
  const { data } = await api.get("/user/orders", {
    params: { page, size },
  });
  return data;
};

export const fetchOrderDetail = async (orderId) => {
  const { data } = await api.get(`/user/orders/${orderId}`);
  return data;
};

export const cancelOrder = async (orderId) => {
  const { data } = await api.post(`/user/orders/${orderId}/cancel`);
  return data;
};

