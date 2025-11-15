import api from "./api";

export const getUserAddresses = async () => {
  const { data } = await api.get("/users/addresses");
  return data;
};

