import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useChat } from "../../context/ChatContext.jsx";

const SellerInbox = () => {
  const {
    isAuthenticated,
    conversations,
    openConversation,
    activeConversationId,
    messagesByConversation,
    sendMessage,
    currentUserId,
  } = useChat();

  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!isAuthenticated || conversations.length === 0) {
      return;
    }
    if (!activeConversationId) {
      openConversation(conversations[0].id);
    }
  }, [isAuthenticated, conversations, activeConversationId, openConversation]);

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeConversationId),
    [conversations, activeConversationId]
  );

  const messages = useMemo(() => {
    if (!activeConversationId) return [];
    return messagesByConversation[activeConversationId] || [];
  }, [activeConversationId, messagesByConversation]);

  const handleSelectConversation = async (conversationId) => {
    await openConversation(conversationId);
    setDraft("");
  };

  const handleSend = (event) => {
    event.preventDefault();
    if (!draft.trim() || !activeConversationId) return;
    sendMessage(activeConversationId, draft);
    setDraft("");
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center">
        <p className="text-slate-500 text-sm">
          Đăng nhập với tư cách nhà bán để quản lý tin nhắn.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[520px]">
        <aside className="border-r border-slate-200 bg-slate-50">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Tin nhắn</h2>
            <p className="text-xs text-slate-500 mt-1">
              Quản lý trao đổi với khách hàng
            </p>
          </div>
          <div className="overflow-y-auto max-h-[520px]">
            {conversations.length === 0 ? (
              <div className="px-6 py-10 text-sm text-slate-500">
                Chưa có cuộc trò chuyện nào.
              </div>
            ) : (
              conversations.map((conversation) => {
                const isActive = activeConversationId === conversation.id;
                const isCurrentSeller =
                  conversation.seller?.participantId === currentUserId;
                const partner = isCurrentSeller
                  ? conversation.user
                  : conversation.seller;
                const unread = isCurrentSeller
                  ? conversation.sellerUnreadCount
                  : conversation.userUnreadCount;
                return (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={`w-full text-left px-6 py-4 border-b border-slate-200 transition-colors ${
                      isActive ? "bg-white" : "hover:bg-white/70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800">
                        {partner?.displayName || "Khách hàng"}
                      </span>
                      {conversation.lastMessageAt && (
                        <span className="text-[11px] text-slate-400">
                          {dayjs(conversation.lastMessageAt).format(
                            "DD/MM HH:mm"
                          )}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {conversation.lastMessageSnippet || "Chưa có tin nhắn"}
                    </p>
                    {unread > 0 && (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-500 px-2 py-[2px] text-[11px] text-white">
                        {unread} tin nhắn mới
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className="lg:col-span-2 flex flex-col">
          {activeConversation ? (
            <>
              <header className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {activeConversation.seller?.participantId === currentUserId
                      ? activeConversation.user?.displayName
                      : activeConversation.seller?.displayName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Trao đổi trực tiếp với khách hàng
                  </p>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-slate-50">
                {messages.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center mt-20">
                    Bắt đầu hội thoại với khách hàng.
                  </p>
                ) : (
                  messages.map((message) => {
                    const isOwnMessage = message.senderId === currentUserId;
                    return (
                      <div
                        key={message.id}
                        className={`flex flex-col ${
                          isOwnMessage ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2 rounded-2xl max-w-md text-sm leading-relaxed ${
                            isOwnMessage
                              ? "bg-blue-600 text-white"
                              : "bg-white text-slate-800 border border-slate-200"
                          }`}
                        >
                          {message.content}
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1">
                          {dayjs(message.sentAt).format("HH:mm DD/MM/YYYY")}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              <form
                onSubmit={handleSend}
                className="border-t border-slate-200 px-6 py-4 bg-white flex items-center gap-3"
              >
                <input
                  type="text"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors"
                >
                  Gửi
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
              Chọn một cuộc trò chuyện để bắt đầu trao đổi.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SellerInbox;

