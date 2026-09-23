import { useEffect, useState } from "react";
import "./App.css";
import {
  sendMessage,
  receiveNotification,
  deleteNotification,
} from "./services/greenApi";

function App() {
  const [connected, setConnected] = useState(false);

  const [idInstance, setIdInstance] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [apiUrl, setApiUrl] = useState("");

  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!connected || !phone) return;

    let stopped = false;

    const receiveLoop = async () => {
      while (!stopped) {
        try {
          console.log("Waiting for Telegram message...");

          const notification = await receiveNotification({
            apiUrl: apiUrl.replace(/\/$/, ""),
            idInstance,
            apiTokenInstance: apiToken,
          });

          if (stopped) break;

          if (!notification) {
            continue;
          }

          console.log("GREEN-API notification:", notification);

          const body = notification.body;

          console.log(
            "Notification type:",
            body?.typeWebhook
          );

          const isOutgoing =
            body?.typeWebhook === "outgoingMessageReceived" ||
            body?.typeWebhook === "outgoingAPIMessageReceived";

          const receivedMessage =
            body?.messageData?.textMessageData?.textMessage ||
            body?.messageData?.extendedTextMessageData?.textMessage ||
            "";

          const receivedChatId =
            body?.senderData?.chatId || "";

          console.log("Is outgoing:", isOutgoing);
          console.log("Received chat:", receivedChatId);
          console.log("Received text:", receivedMessage);

          if (
            receivedMessage &&
            String(receivedChatId) === String(phone) &&
            !isOutgoing
          ) {
            setMessages((previous) => [
              ...previous,
              {
                id: `received-${Date.now()}`,
                text: receivedMessage,
                sender: "other",
              },
            ]);
          }

          if (notification.receiptId) {
            await deleteNotification({
              apiUrl: apiUrl.replace(/\/$/, ""),
              idInstance,
              apiTokenInstance: apiToken,
              receiptId: notification.receiptId,
            });

            console.log(
              "Notification deleted:",
              notification.receiptId
            );
          }
        } catch (error) {
          if (!stopped) {
            console.error("Receive error:", error);

            await new Promise((resolve) =>
              setTimeout(resolve, 2000)
            );
          }
        }
      }
    };

    receiveLoop();

    return () => {
      stopped = true;
    };
  }, [connected, phone, apiUrl, idInstance, apiToken]);

  const handleConnect = (e) => {
    e.preventDefault();

    if (!idInstance || !apiToken || !apiUrl) {
      setError("Please enter all GREEN-API credentials.");
      return;
    }

    setError("");
    setConnected(true);
  };

  const createChat = (e) => {
    e.preventDefault();

    if (!phone.trim()) {
      return;
    }

    setPhone(phone.trim());
    setError("");
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const text = message.trim();

    if (!text || !phone || sending) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const result = await sendMessage({
        apiUrl: apiUrl.replace(/\/$/, ""),
        idInstance,
        apiTokenInstance: apiToken,
        chatId: phone,
        message: text,
      });

      console.log("GREEN-API response:", result);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now(),
          text,
          sender: "me",
        },
      ]);

      setMessage("");
    } catch (error) {
      console.error("Send message error:", error);

      setError(
        error.message || "Could not send the message."
      );
    } finally {
      setSending(false);
    }
  };

  if (!connected) {
    return (
      <div className="app">
        <div className="login-card">
          <div className="logo">MAX</div>

          <h1>MAX Chat</h1>

          <p className="subtitle">
            Connect your GREEN-API account
          </p>

          <form onSubmit={handleConnect}>
            <label>ID Instance</label>

            <input
              type="text"
              placeholder="Enter ID Instance"
              value={idInstance}
              onChange={(e) =>
                setIdInstance(e.target.value)
              }
            />

            <label>API Token Instance</label>

            <input
              type="password"
              placeholder="Enter API Token Instance"
              value={apiToken}
              onChange={(e) =>
                setApiToken(e.target.value)
              }
            />

            <label>API URL</label>

            <input
              type="text"
              placeholder="https://xxxx.api.green-api.com"
              value={apiUrl}
              onChange={(e) =>
                setApiUrl(e.target.value)
              }
            />

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="primary-button"
            >
              Connect
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo small">MAX</div>

          <button
            className="new-chat-button"
            type="button"
            onClick={() => {
              setPhone("");
              setMessages([]);
              setError("");
            }}
          >
            +
          </button>
        </div>

        <div className="new-chat">
          <h3>New chat</h3>

          <form onSubmit={createChat}>
            <input
              type="text"
              placeholder="Telegram chat ID"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
            />

            <button type="submit">
              Start
            </button>
          </form>
        </div>

        <div className="chat-list">
          {phone && (
            <div className="chat-item active">
              <div className="avatar">
                {phone.charAt(phone.length - 1)}
              </div>

              <div>
                <strong>{phone}</strong>
                <p>Telegram</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="chat-window">
        {phone ? (
          <>
            <header className="chat-header">
              <div className="avatar">
                {phone.charAt(phone.length - 1)}
              </div>

              <div>
                <strong>{phone}</strong>
                <span>Telegram</span>
              </div>
            </header>

            <div className="messages">
              {messages.length === 0 ? (
                <div className="empty-chat">
                  <div className="empty-icon">
                    💬
                  </div>

                  <h2>
                    Start a conversation
                  </h2>

                  <p>
                    Send a message to {phone}
                  </p>
                </div>
              ) : (
                messages.map((item) => (
                  <div
                    key={item.id}
                    className={`message ${
                      item.sender === "me"
                        ? "message-me"
                        : "message-other"
                    }`}
                  >
                    {item.text}
                  </div>
                ))
              )}
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form
              className="message-input"
              onSubmit={handleSendMessage}
            >
              <input
                type="text"
                placeholder="Write a message..."
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
              />

              <button
                type="submit"
                disabled={sending}
              >
                {sending ? "..." : "➤"}
              </button>
            </form>
          </>
        ) : (
          <div className="welcome-screen">
            <div className="welcome-icon">
              💬
            </div>

            <h2>MAX Chat</h2>

            <p>
              Create a new chat to start messaging
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
