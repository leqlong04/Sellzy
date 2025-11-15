import { useMemo, useState } from "react";
import { MdChatBubble } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useChat } from "../../context/ChatContext.jsx";
import dayjs from "dayjs";

const ChatWidget = () => {
  const {
    conversations,
    messagesByConversation,
    widgetOpen,
    setWidgetOpen,
    openConversation,
    activeConversationId,
    sendMessage,
    isAuthenticated,
    currentUserId,
  } = useChat();
  const [messageDraft, setMessageDraft] = useState("");

  const activeMessages = useMemo(() => {
    if (!activeConversationId) return [];
    return messagesByConversation[activeConversationId] || [];
  }, [activeConversationId, messagesByConversation]);

  const handleToggleWidget = () => {
    if (!isAuthenticated) {
      setWidgetOpen(false);
      return;
    }
    setWidgetOpen(!widgetOpen);
  };

  const handleSelectConversation = async (conversationId) => {
    await openConversation(conversationId);
  };

  const handleSend = (event) => {
    event?.preventDefault();
    if (!messageDraft.trim() || !activeConversationId) return;
    sendMessage(activeConversationId, messageDraft);
    setMessageDraft("");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleToggleWidget}
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-500 transition-colors"
      >
        {widgetOpen ? <IoMdClose size={24} /> : <MdChatBubble size={24} />}
      </button>

      {widgetOpen && (
        <div className="fixed bottom-20 right-6 z-40 shadow-2xl border border-slate-200 bg-white rounded-xl w-[360px] h-[520px] flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-700">Messages</h3>
          </div>

          <div className="flex-1 flex min-h-0">
            <aside className="w-36 border-r border-slate-200 overflow-y-auto scrollbar-thin">
              {conversations.length === 0 ? (
                <div className="p-4 text-xs text-slate-500">
                  You don’t have any conversations yet.
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
                  const displayName = partner?.displayName || "Partner";
                  return (
                    <button
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation.id)}
                      className={`w-full text-left px-3 py-3 border-b border-slate-100 hover:bg-slate-100 transition-colors ${
                        isActive ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="text-xs font-semibold text-slate-700 truncate">
                        {displayName}
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-2">
                        {conversation.lastMessageSnippet || "No messages yet"}
                      </div>
                      {unread > 0 && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-500 px-2 py-[2px] text-[10px] text-white">
                          {unread} new
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </aside>

            <section className="flex-1 flex flex-col min-h-0">
              {activeConversationId ? (
                <>
                  <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 space-y-3 flex flex-col">
                    {activeMessages.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center mt-auto">
                        Start your conversation.
                      </p>
                    ) : (
                      activeMessages.map((message) => {
                        const isOwnMessage = message.senderId === currentUserId;
                        return (
                          <div
                            key={message.id}
                            className={`flex flex-col ${
                              isOwnMessage ? "items-end" : "items-start"
                            }`}
                          >
                            <div
                              className={`rounded-2xl px-3 py-2 text-sm max-w-[200px] ${
                                isOwnMessage
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-800"
                              }`}
                            >
                              {message.content}
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1">
                              {dayjs(message.sentAt).format("HH:mm DD/MM")}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <form
                    className="border-t border-slate-200 p-3 flex items-center gap-2"
                    onSubmit={handleSend}
                  >
                    <input
                      type="text"
                      value={messageDraft}
                      onChange={(event) => setMessageDraft(event.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 text-sm border border-slate-200 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-blue-500 transition-colors"
                    >
                      Send
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
                  Select a conversation to start chatting
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;

