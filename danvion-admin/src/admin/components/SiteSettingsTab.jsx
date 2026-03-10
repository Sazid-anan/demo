import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Save,
  Settings,
  Mail,
  Link as LinkIcon,
  MapPin,
  Phone,
  AlertCircle,
  X,
} from "lucide-react";
import Button from "../../components/ui/Button";
import { addAuditLog } from "../../redux/slices/auditSlice";

export default function SiteSettingsTab() {
  const dispatch = useDispatch();
  const { adminEmail, adminRole } = useSelector((state) => state.auth);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Load settings from localStorage.
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("siteSettings");
    return saved
      ? JSON.parse(saved)
      : {
          company: {
            name: "DANVION",
            tagline: "Leading provider of Edge AI solutions",
            email: "support@danvion.com",
            phone: "+44 (0) 20 1234 5678",
            address: "128 City Road, London, EC1V 2NX, GB",
          },
          social: {
            linkedin: "https://linkedin.com/company/danvion",
            twitter: "https://twitter.com/danvion",
            github: "https://github.com/danvion",
            facebook: "https://facebook.com/danvion",
          },
          email: {
            enableAutoResponder: true,
            autoResponderSubject: "Thank you for contacting us!",
            autoResponderMessage:
              "We received your message and will get back to you within 24 hours.",
            noReplyEmail: "noreply@danvion.com",
            supportEmail: "support@danvion.com",
          },
          features: {
            enableContactForm: true,
            enableBlog: true,
            enableTestimonials: true,
            enableTeamSection: true,
          },
        };
  });

  const handleSave = async () => {
    try {
      setErrorMessage("");
      setSaveSuccess(false);

      // Validate required fields
      if (!settings.company.name.trim()) {
        setErrorMessage("Company name is required");
        return;
      }

      if (!settings.company.email.trim()) {
        setErrorMessage("Email is required");
        return;
      }

      // Save to localStorage.
      localStorage.setItem("siteSettings", JSON.stringify(settings));

      // Log audit
      dispatch(
        addAuditLog({
          adminEmail,
          adminRole,
          action: "update",
          section: "settings",
          itemName: "Site Settings",
          description: "Updated site configuration",
          status: "success",
        }),
      );

      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setErrorMessage(error.message || "Failed to save settings");
      dispatch(
        addAuditLog({
          adminEmail,
          adminRole,
          action: "update",
          section: "settings",
          itemName: "Site Settings",
          status: "error",
          errorMessage: error.message,
        }),
      );
    }
  };

  const handleInputChange = (path, value) => {
    const keys = path.split(".");
    setSettings((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const canEdit = adminRole === "admin";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-6 w-6 text-brand-orange" />
          <h2 className="text-h3 font-bold text-brand-black">Site Settings</h2>
        </div>
        <p className="text-gray-600">
          {canEdit
            ? "Manage your site configuration"
            : "View site configuration (read-only)"}
        </p>
      </div>

      {!canEdit && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700 text-sm rounded-lg flex gap-3"
        >
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">View-Only Mode</p>
            <p>
              Only admins can edit site settings. Contact an admin for changes.
            </p>
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
          <AlertCircle className="h-5 w-5 shrink-0" />
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
          ✅ Settings saved successfully!
        </motion.div>
      )}

      {/* Company Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <div className="border-b-2 border-gray-100 pb-4">
          <h3 className="text-h4 font-bold text-brand-black mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-brand-orange" />
            Company Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={settings.company.name}
                onChange={(e) =>
                  handleInputChange("company.name", e.target.value)
                }
                disabled={!canEdit}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={settings.company.tagline}
                onChange={(e) =>
                  handleInputChange("company.tagline", e.target.value)
                }
                disabled={!canEdit}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-brand-black mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <input
                type="email"
                value={settings.company.email}
                onChange={(e) =>
                  handleInputChange("company.email", e.target.value)
                }
                disabled={!canEdit}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-brand-black mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </label>
              <input
                type="tel"
                value={settings.company.phone}
                onChange={(e) =>
                  handleInputChange("company.phone", e.target.value)
                }
                disabled={!canEdit}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-brand-black mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </label>
              <textarea
                value={settings.company.address}
                onChange={(e) =>
                  handleInputChange("company.address", e.target.value)
                }
                disabled={!canEdit}
                rows="2"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-b-2 border-gray-100 pb-4">
          <h3 className="text-h4 font-bold text-brand-black mb-4 flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-brand-orange" />
            Social Media Links
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(settings.social).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-brand-black mb-2 capitalize">
                  {key}
                </label>
                <input
                  type="url"
                  value={value}
                  onChange={(e) =>
                    handleInputChange(`social.${key}`, e.target.value)
                  }
                  disabled={!canEdit}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="https://..."
                />
              </div>
            ))}
          </div>
        </div>

        {/* Email Configuration */}
        <div>
          <h3 className="text-h4 font-bold text-brand-black mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-brand-orange" />
            Email Configuration
          </h3>

          <div className="space-y-4">
            {/* Support Email */}
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">
                Support Email
              </label>
              <input
                type="email"
                value={settings.email.supportEmail}
                onChange={(e) =>
                  handleInputChange("email.supportEmail", e.target.value)
                }
                disabled={!canEdit}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* No Reply Email */}
            <div>
              <label className="block text-sm font-semibold text-brand-black mb-2">
                No Reply Email
              </label>
              <input
                type="email"
                value={settings.email.noReplyEmail}
                onChange={(e) =>
                  handleInputChange("email.noReplyEmail", e.target.value)
                }
                disabled={!canEdit}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Auto Responder Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enableAutoResponder"
                checked={settings.email.enableAutoResponder}
                onChange={(e) =>
                  handleInputChange(
                    "email.enableAutoResponder",
                    e.target.checked,
                  )
                }
                disabled={!canEdit}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <label
                htmlFor="enableAutoResponder"
                className="text-sm font-semibold text-brand-black"
              >
                Enable Auto-Responder
              </label>
            </div>

            {settings.email.enableAutoResponder && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-2">
                    Auto Response Subject
                  </label>
                  <input
                    type="text"
                    value={settings.email.autoResponderSubject}
                    onChange={(e) =>
                      handleInputChange(
                        "email.autoResponderSubject",
                        e.target.value,
                      )
                    }
                    disabled={!canEdit}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-black mb-2">
                    Auto Response Message
                  </label>
                  <textarea
                    value={settings.email.autoResponderMessage}
                    onChange={(e) =>
                      handleInputChange(
                        "email.autoResponderMessage",
                        e.target.value,
                      )
                    }
                    disabled={!canEdit}
                    rows="4"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      {canEdit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-4"
        >
          <Button onClick={handleSave} size="lg" variant="default">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
          {isEditing && (
            <Button
              onClick={() => setIsEditing(false)}
              size="lg"
              variant="outline"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
