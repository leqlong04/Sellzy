import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  createConversation as apiCreateConversation,
  fetchConversations as apiFetchConversations,
  fetchMessages as apiFetchMessages,
  markConversationRead as apiMarkConversationRead,
  sendMessageFallback,
} from "../api/chat";
import api from "../api/api";

const ChatContext = createContext(null);

const extractJwtFromCookieString = (value) => {
  if (!value) return null;
  const firstPart = value.split(";")[0];
  const separatorIndex = firstPart.indexOf("=");
  if (separatorIndex === -1) {
    return firstPart.trim();
  }
  return firstPart.substring(separatorIndex + 1).trim();
};

const baseApiUrl =
  (import.meta.env.VITE_BACK_END_URL &&
    String(import.meta.env.VITE_BACK_END_URL).trim().length > 0 &&
    String(import.meta.env.VITE_BACK_END_URL).trim()) ||
  "http://localhost:8080";

const WS_ENDPOINT = `${baseApiUrl}/ws/chat`;

export const ChatProvider = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const rawToken = useMemo(
    () => extractJwtFromCookieString(user?.jwtToken),
    [user?.jwtToken]
  );
  const isAuthenticated = Boolean(user && rawToken);

  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messagesByConversation, setMessagesByConversation] = useState({});
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [widgetOpen, setWidgetOpen] = useState(false);

  const disconnectClient = useCallback(() => {
    if (clientRef.current) {
      try {
        clientRef.current.deactivate();
      } catch (error) {
        console.error("Failed to disconnect chat client", error);
      } finally {
        clientRef.current = null;
        setConnected(false);
      }
    }
  }, []);

  useEffect(() => {
    if (rawToken) {
      api.defaults.headers.common.Authorization = `Bearer ${rawToken}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [rawToken]);

  useEffect(() => {
    if (!isAuthenticated) {
      setConversations([]);
      setMessagesByConversation({});
      setActiveConversationId(null);
      disconnectClient();
      return;
    }

    const loadConversations = async () => {
      setLoading(true);
      try {
        const data = await apiFetchConversations();
        const sorted = [...data].sort((a, b) => {
          const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
          const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
          return bTime - aTime;
        });
        setConversations(sorted);
      } catch (error) {
        console.error("Failed to load chat conversations", error);
        toast.error("Không thể tải danh sách trò chuyện");
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [isAuthenticated, disconnectClient, rawToken]);

  const subscribeToTopics = useCallback(
    (client) => {
      client.subscribe("/user/queue/chat/messages", (message) => {
        try {
          const payload = JSON.parse(message.body);
          setMessagesByConversation((prev) => {
            const current = prev[payload.conversationId] || [];
            const updated = [...current, payload];
            return {
              ...prev,
              [payload.conversationId]: updated,
            };
          });
        } catch (error) {
          console.error("Failed to parse incoming chat message", error);
        }
      });

      client.subscribe("/user/queue/chat/conversations", (message) => {
        try {
          const payload = JSON.parse(message.body);
          setConversations((prev) => {
            const existingIndex = prev.findIndex(
              (item) => item.id === payload.id
            );
            if (existingIndex >= 0) {
              const clone = [...prev];
              clone[existingIndex] = payload;
              return clone.sort((a, b) => {
                const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
                const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
                return bTime - aTime;
              });
            }
            return [payload, ...prev].sort((a, b) => {
              const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
              const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
              return bTime - aTime;
            });
          });
        } catch (error) {
          console.error("Failed to parse conversation update", error);
        }
      });
    },
    []
  );

  const connectClient = useCallback(() => {
    if (!isAuthenticated || clientRef.current || !rawToken) {
      return;
    }
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_ENDPOINT),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${rawToken}`,
      },
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.debug(str);
        }
      },
    });

    client.onConnect = () => {
      setConnected(true);
      subscribeToTopics(client);
    };

    client.onStompError = (frame) => {
      console.error("Broker reported error: ", frame.headers["message"]);
      console.error("Additional details: ", frame.body);
      toast.error("Kết nối chat gặp lỗi");
    };

    client.onWebSocketError = (error) => {
      console.error("WebSocket error", error);
      toast.error("Không thể kết nối máy chủ chat");
    };

    client.activate();
    clientRef.current = client;
  }, [isAuthenticated, subscribeToTopics, rawToken]);

  useEffect(() => {
    connectClient();
    return () => disconnectClient();
  }, [connectClient, disconnectClient]);

  const ensureConversationMessages = useCallback(
    async (conversationId) => {
      if (messagesByConversation[conversationId]) {
        return;
      }
      try {
        const data = await apiFetchMessages(conversationId, { page: 0, size: 50 });
        const chronological = [...data].reverse();
        setMessagesByConversation((prev) => ({
          ...prev,
          [conversationId]: chronological,
        }));
      } catch (error) {
        console.error("Failed to load messages", error);
        toast.error("Không thể tải tin nhắn");
      }
    },
    [messagesByConversation]
  );

  const openConversation = useCallback(
    async (conversationId) => {
      if (!conversationId) return;
      setWidgetOpen(true);
      setActiveConversationId(conversationId);
      await ensureConversationMessages(conversationId);
      try {
        await apiMarkConversationRead(conversationId);
      } catch (error) {
        console.warn("Failed to mark conversation as read", error);
      }
    },
    [ensureConversationMessages]
  );

  const startConversationWithSeller = useCallback(
    async (sellerId) => {
      if (!sellerId) return null;
      try {
        const conversation = await apiCreateConversation({ sellerId });
        setConversations((prev) => {
          const exists = prev.some((item) => item.id === conversation.id);
          if (exists) return prev;
          return [conversation, ...prev].sort((a, b) => {
            const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
            const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
            return bTime - aTime;
          });
        });
        await openConversation(conversation.id);
        return conversation;
      } catch (error) {
        console.error("Failed to create conversation", error);
        toast.error("Không thể bắt đầu cuộc trò chuyện");
        return null;
      }
    },
    [openConversation]
  );

  const sendMessage = useCallback(
    async (conversationId, content) => {
      if (!conversationId || !content || !content.trim()) return;
      const client = clientRef.current;

      if (client && connected) {
        client.publish({
          destination: "/app/chat/send",
          body: JSON.stringify({ conversationId, content }),
        });
      } else {
        try {
          const fallback = await sendMessageFallback(conversationId, content);
          setMessagesByConversation((prev) => {
            const current = prev[conversationId] || [];
            return {
              ...prev,
              [conversationId]: [...current, fallback],
            };
          });
        } catch (error) {
          console.error("Failed to send message", error);
          toast.error("Gửi tin nhắn thất bại");
        }
      }
    },
    [connected]
  );

  const currentUserId = user?.id;

  const value = useMemo(
    () => ({
      isAuthenticated,
      connected,
      loading,
      conversations,
      messagesByConversation,
      activeConversationId,
      widgetOpen,
      setWidgetOpen,
      openConversation,
      startConversationWithSeller,
      sendMessage,
      setActiveConversationId,
      currentUserId,
      rawToken,
    }),
    [
      isAuthenticated,
      connected,
      loading,
      conversations,
      messagesByConversation,
      activeConversationId,
      widgetOpen,
      openConversation,
      startConversationWithSeller,
      sendMessage,
      currentUserId,
      rawToken,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

