import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../../services/firebaseClient";
import Button from "../../components/ui/Button";

const formatDate = (value) => {
  if (!value) return "";
  if (typeof value === "string") return new Date(value).toLocaleString();
  if (value?.seconds) return new Date(value.seconds * 1000).toLocaleString();
  return "";
};

export default function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [lastDeleted, setLastDeleted] = useState(null);
  const [messageQuery, setMessageQuery] = useState("");
  const [lastLoadedAt, setLastLoadedAt] = useState("");

  const filteredMessages = useMemo(() => {
    const queryText = messageQuery.trim().toLowerCase();
    if (!queryText) return messages;
    return messages.filter((message) => {
      const name = String(message.name || "").toLowerCase();
      const email = String(message.email || "").toLowerCase();
      const content = String(message.message || "").toLowerCase();
      return (
        name.includes(queryText) ||
        email.includes(queryText) ||
        content.includes(queryText)
      );
    });
  }, [messages, messageQuery]);

  const selectedMessage = useMemo(() => {
    return (
      filteredMessages.find((msg) => msg.id === selectedId) ||
      filteredMessages[0] ||
      null
    );
  }, [filteredMessages, selectedId]);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const snap = await getDocs(
        query(
          collection(db, "contact_messages"),
          orderBy("created_at", "desc"),
        ),
      );
      const data = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setMessages(data);
      setLastLoadedAt(new Date().toLocaleString());
      if (!selectedId && data.length > 0) {
        setSelectedId(data[0].id);
      }
    } catch (err) {
      setError(err?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Delete this message?")) return;
    setDeletingId(id);
    setError("");
    try {
      const deleted = messages.find((msg) => msg.id === id);
      await deleteDoc(doc(db, "contact_messages", id));
      const nextMessages = messages.filter((msg) => msg.id !== id);
      setMessages(nextMessages);
      setSelectedId((prev) =>
        prev === id ? nextMessages[0]?.id || null : prev,
      );
      if (deleted) {
        setLastDeleted({ id, data: deleted });
      }
    } catch (err) {
      setError(err?.message || "Failed to delete message");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUndo = async () => {
    if (!lastDeleted?.id || !lastDeleted?.data) return;
    setError("");
    try {
      const { id, data } = lastDeleted;
      const { id: _id, ...payload } = data;
      await setDoc(doc(db, "contact_messages", id), payload);
      setLastDeleted(null);
      await loadMessages();
    } catch (err) {
      setError(err?.message || "Failed to restore message");
    }
  };

  const handleToggleRead = async (id, currentReadStatus) => {
    try {
      const newReadStatus = !currentReadStatus;
      await setDoc(
        doc(db, "contact_messages", id),
        { is_read: newReadStatus },
        { merge: true },
      );
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, is_read: newReadStatus } : msg,
        ),
      );
    } catch (err) {
      setError(err?.message || "Failed to update message status");
    }
  };

  const handleExportCSV = () => {
    if (messages.length === 0) {
      alert("No messages to export");
      return;
    }

    const headers = [
      "Date",
      "Name",
      "Email",
      "Phone",
      "Company",
      "Message",
      "Status",
    ];
    const rows = messages.map((msg) => [
      formatDate(msg.created_at),
      msg.name || "",
      msg.email || "",
      msg.phone || "",
      msg.company || "",
      `"${(msg.message || "").replace(/"/g, '""')}"`,
      msg.is_read ? "Read" : "Unread",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `danvion-messages-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-black mb-2">
            Contact Messages
          </h2>
          <p className="text-gray-600 text-sm">
            View messages sent from the website contact form
          </p>
          {lastLoadedAt && (
            <p className="text-xs text-gray-500 mt-2">
              Last loaded: {lastLoadedAt}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={messageQuery}
            onChange={(e) => setMessageQuery(e.target.value)}
            placeholder="Search messages"
            className="w-full sm:w-56 px-4 py-2 border rounded-lg text-sm"
          />
          <Button onClick={loadMessages} size="md" disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            onClick={handleExportCSV}
            size="md"
            variant="outline"
            disabled={messages.length === 0}
          >
            <span className="inline-flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="admin-section admin-section--soft p-4 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {lastDeleted && (
        <div className="admin-section admin-section--soft p-4 text-gray-700 border border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <span>Message deleted. You can undo this action.</span>
          <button
            type="button"
            onClick={handleUndo}
            className="px-4 py-2 text-sm bg-brand-orange text-brand-black rounded-lg hover:shadow-md transition-all"
          >
            Undo
          </button>
        </div>
      )}

      {messages.length === 0 && !loading ? (
        <div className="admin-section admin-section--soft p-8 text-center text-gray-600">
          No messages yet. Submissions from the website will appear here.
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="admin-section admin-section--soft p-8 text-center text-gray-600">
          No messages match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <div className="space-y-3">
            {filteredMessages.map((message) => (
              <button
                key={message.id}
                type="button"
                onClick={() => setSelectedId(message.id)}
                className={`admin-card-lite w-full text-left p-4 transition-all relative ${
                  selectedId === message.id
                    ? "border-brand-orange shadow-lg"
                    : "hover:shadow-md"
                }`}
              >
                {!message.is_read && (
                  <div className="absolute top-2 left-2 w-2 h-2 bg-brand-orange rounded-full"></div>
                )}
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-brand-black text-sm">
                    {message.name || "Anonymous"}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formatDate(message.created_at)}
                  </span>
                </div>
                <p className="text-xs text-brand-orange mt-1 break-all">
                  {message.email || "No email"}
                </p>
                <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                  {message.message || "(empty message)"}
                </p>
              </button>
            ))}
          </div>

          <div className="admin-section p-6">
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-brand-black">
                      {selectedMessage.name || "Anonymous"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(selectedMessage.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleRead(
                          selectedMessage.id,
                          selectedMessage.is_read,
                        )
                      }
                      className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      {selectedMessage.is_read ? "Mark Unread" : "Mark Read"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(selectedMessage.id)}
                      disabled={deletingId === selectedMessage.id}
                      className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-60"
                    >
                      {deletingId === selectedMessage.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="admin-card-lite p-4">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-semibold text-brand-black break-all">
                      {selectedMessage.email || "N/A"}
                    </p>
                  </div>
                  <div className="admin-card-lite p-4">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-semibold text-brand-black">
                      {selectedMessage.phone || "N/A"}
                    </p>
                  </div>
                  <div className="admin-card-lite p-4">
                    <p className="text-xs text-gray-500">Company</p>
                    <p className="text-sm font-semibold text-brand-black">
                      {selectedMessage.company || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="admin-card-lite p-5">
                  <p className="text-xs text-gray-500 mb-2">Message</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedMessage.message || "(empty message)"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Select a message to view details.</p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
