import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Mail, Plus, Edit2, Trash2, Save, X, AlertCircle, CheckCircle, EyeOff } from "lucide-react";
import Button from "../../components/ui/Button";
import { addAuditLog } from "../../redux/slices/auditSlice";

export default function EmailTemplatesTab() {
  const dispatch = useDispatch();
  const { adminEmail, adminRole } = useSelector((state) => state.auth);
  const [templates, setTemplates] = useState(() => {
    const saved = localStorage.getItem("emailTemplates");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Contact Form Auto-Response",
            subject: "We received your message",
            body: "Thank you for contacting us! We'll get back to you within 24 hours.",
            type: "auto-responder",
            enabled: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 2,
            name: "New Message Notification",
            subject: "New contact form submission",
            body: "A new message has been received from the contact form.",
            type: "admin-notification",
            enabled: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
    type: "auto-responder",
    enabled: true,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const canEdit = adminRole === "admin" || adminRole === "editor";

  const handleAddTemplate = () => {
    setEditingId(null);
    setFormData({
      name: "",
      subject: "",
      body: "",
      type: "auto-responder",
      enabled: true,
    });
    setShowForm(true);
    setErrorMessage("");
  };

  const handleEditTemplate = (template) => {
    if (!canEdit) return;
    setEditingId(template.id);
    setFormData({
      name: template.name,
      subject: template.subject,
      body: template.body,
      type: template.type,
      enabled: template.enabled,
    });
    setShowForm(true);
    setErrorMessage("");
  };

  const handleSaveTemplate = async () => {
    try {
      setErrorMessage("");

      if (!formData.name.trim()) {
        setErrorMessage("Template name is required");
        return;
      }

      if (!formData.subject.trim()) {
        setErrorMessage("Subject is required");
        return;
      }

      if (!formData.body.trim()) {
        setErrorMessage("Body is required");
        return;
      }

      let updated;
      if (editingId) {
        updated = templates.map((t) =>
          t.id === editingId
            ? {
                ...t,
                ...formData,
                updatedAt: new Date().toISOString(),
              }
            : t,
        );
        dispatch(
          addAuditLog({
            adminEmail,
            adminRole,
            action: "update",
            section: "email",
            itemId: editingId,
            itemName: formData.name,
            description: "Updated email template",
            status: "success",
          }),
        );
      } else {
        const newTemplate = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        updated = [...templates, newTemplate];
        dispatch(
          addAuditLog({
            adminEmail,
            adminRole,
            action: "create",
            section: "email",
            itemId: newTemplate.id,
            itemName: formData.name,
            description: "Created new email template",
            status: "success",
          }),
        );
      }

      setTemplates(updated);
      localStorage.setItem("emailTemplates", JSON.stringify(updated));
      setSaveSuccess(true);
      setShowForm(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setErrorMessage(error.message || "Failed to save template");
      dispatch(
        addAuditLog({
          adminEmail,
          adminRole,
          action: editingId ? "update" : "create",
          section: "email",
          itemName: formData.name,
          status: "error",
          errorMessage: error.message,
        }),
      );
    }
  };

  const handleDeleteTemplate = (id) => {
    if (!canEdit || !window.confirm("Are you sure you want to delete this template?")) return;

    const template = templates.find((t) => t.id === id);
    setTemplates(templates.filter((t) => t.id !== id));
    localStorage.setItem("emailTemplates", JSON.stringify(templates.filter((t) => t.id !== id)));

    dispatch(
      addAuditLog({
        adminEmail,
        adminRole,
        action: "delete",
        section: "email",
        itemId: id,
        itemName: template.name,
        description: "Deleted email template",
        status: "success",
      }),
    );
  };

  const handleToggleTemplate = (id) => {
    if (!canEdit) return;
    const updated = templates.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t));
    setTemplates(updated);
    localStorage.setItem("emailTemplates", JSON.stringify(updated));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Mail className="h-6 w-6 text-brand-orange" />
            <h2 className="text-h3 font-bold text-brand-black">Email Templates</h2>
          </div>
          <p className="text-gray-600">Manage auto-response and notification email templates</p>
        </div>
        {canEdit && (
          <Button onClick={handleAddTemplate} size="lg" variant="default">
            <Plus className="h-4 w-4" />
            New Template
          </Button>
        )}
      </div>

      {!canEdit && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700 text-sm rounded-lg flex gap-3"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">View-Only Mode</p>
            <p>Only admins and editors can manage email templates.</p>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded-lg flex gap-3"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          {errorMessage}
        </motion.div>
      )}

      {/* Success Message */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-4 bg-green-50 border-l-4 border-green-400 text-green-700 text-sm rounded-lg"
        >
          ✅ Email template saved successfully!
        </motion.div>
      )}

      {/* Template Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-50 to-white border-2 border-brand-orange rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-h4 font-bold text-brand-black">
              {editingId ? "Edit Template" : "New Template"}
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Template Name */}
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">
                Template Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Contact Form Auto-Response"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none"
              />
            </div>

            {/* Template Type */}
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none"
              >
                <option value="auto-responder">Auto-Responder (to user)</option>
                <option value="admin-notification">Admin Notification</option>
                <option value="welcome">Welcome Email</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">
                Email Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Enter email subject"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">
                Email Body
              </label>
              <textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="Enter email body (supports HTML)"
                rows="8"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                Tip: Use {"{sender_name}"}, {"{sender_email}"}, {"{message}"} as placeholders
              </p>
            </div>

            {/* Enabled Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enabled"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="enabled" className="text-sm font-semibold text-brand-black">
                Enable this template
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveTemplate} size="md" variant="default">
                <Save className="h-4 w-4" />
                Save Template
              </Button>
              <Button onClick={() => setShowForm(false)} size="md" variant="outline">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Templates List */}
      <div className="space-y-4">
        {templates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-gray-50 rounded-2xl"
          >
            <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">No email templates yet</p>
            {canEdit && (
              <Button onClick={handleAddTemplate} size="lg" variant="default" className="mt-4">
                <Plus className="h-4 w-4" />
                Create First Template
              </Button>
            )}
          </motion.div>
        ) : (
          templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border-2 rounded-xl p-6 transition-all ${
                template.enabled ? "border-brand-orange bg-orange-50" : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-h4 font-bold text-brand-black">{template.name}</h3>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        template.enabled
                          ? "bg-brand-orange text-brand-black"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {template.enabled ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                      {template.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>Subject:</strong> {template.subject}
                  </p>
                </div>
              </div>

              <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">
                  {template.body}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Updated: {new Date(template.updatedAt).toLocaleDateString()}</span>
                {canEdit && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleToggleTemplate(template.id)}
                      size="sm"
                      variant={template.enabled ? "destructive" : "success"}
                    >
                      {template.enabled ? (
                        <>
                          <EyeOff className="h-4 w-4" /> Disable
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" /> Enable
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleEditTemplate(template)}
                      size="sm"
                      variant="outline"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteTemplate(template.id)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
