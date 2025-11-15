import api from "./api";

export const fetchConversations = async () => {
  const response = await api.get("/chat/conversations");
  return response.data;
};

export const createConversation = async (payload) => {
  const response = await api.post("/chat/conversations", payload);
  return response.data;
};

export const fetchMessages = async (conversationId, params = {}) => {
  const response = await api.get(`/chat/conversations/${conversationId}/messages`, {
    params,
  });
  return response.data;
};

export const markConversationRead = async (conversationId) => {
  const response = await api.patch(`/chat/conversations/${conversationId}/read`);
  return response.data;
};

export const sendMessageFallback = async (conversationId, content) => {
  const response = await api.post("/chat/messages", {
    conversationId,
    content,
  });
  return response.data;
};

