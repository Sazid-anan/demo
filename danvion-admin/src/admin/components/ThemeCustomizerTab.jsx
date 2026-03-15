import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Palette, Save, RotateCcw, Eye, Wand2 } from "lucide-react";
import Button from "../../components/ui/Button";
import { addAuditLog } from "../../redux/slices/auditSlice";

export default function ThemeCustomizerTab() {
  const dispatch = useDispatch();
  const { adminEmail, adminRole } = useSelector((state) => state.auth);
  const canEdit = adminRole === "admin";

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("themeCustom");
    return saved
      ? JSON.parse(saved)
      : {
          colors: {
            primary: "#FF6B35",
            secondary: "#004E89",
            accent: "#F77F00",
            background: "#FFFFFF",
            text: "#1A1A1A",
            lightText: "#6B7280",
          },
          typography: {
            headingFont: "Comfortaa",
            bodyFont: "Inter",
            headingSize: "2.5rem",
            bodySize: "1rem",
          },
          branding: {
            logoUrl: "/admin/logo-optimized.png",
            faviconUrl: "/favicon.ico",
            brandName: "DANVION",
          },
        };
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleColorChange = (key, value) => {
    setTheme({
      ...theme,
      colors: { ...theme.colors, [key]: value },
    });
    setHasChanges(true);
  };

  const handleTypographyChange = (key, value) => {
    setTheme({
      ...theme,
      typography: { ...theme.typography, [key]: value },
    });
    setHasChanges(true);
  };

  const handleSaveTheme = () => {
    localStorage.setItem("themeCustom", JSON.stringify(theme));
    setHasChanges(false);

    dispatch(
      addAuditLog({
        adminEmail,
        adminRole,
        action: "update",
        section: "settings",
        itemName: "Theme Configuration",
        description: "Updated theme customization",
        status: "success",
      }),
    );
  };

  const handleResetTheme = () => {
    if (window.confirm("Reset to default theme?")) {
      localStorage.removeItem("themeCustom");
      window.location.reload();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Palette className="h-6 w-6 text-brand-orange" />
          <h2 className="text-h3 font-bold text-brand-black">
            Theme Customizer
          </h2>
        </div>
        <p className="text-gray-600">Customize colors, fonts, and branding</p>
      </div>

      {!canEdit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700 text-sm rounded-lg"
        >
          Only admin can customize theme.
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Color Customization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Colors */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-h4 font-bold text-brand-black mb-4">
              Brand Colors
            </h3>
            <div className="space-y-4">
              {Object.entries(theme.colors).map(([key, value]) => (
                <div key={key} className="flex items-center gap-4">
                  <label className="w-32 text-sm font-medium text-brand-black capitalize">
                    {key}:
                  </label>
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      disabled={!canEdit}
                      className="w-16 h-10 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      disabled={!canEdit}
                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-h4 font-bold text-brand-black mb-4">
              Typography
            </h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-2">
                    Heading Font
                  </label>
                  <select
                    value={theme.typography.headingFont}
                    onChange={(e) =>
                      handleTypographyChange("headingFont", e.target.value)
                    }
                    disabled={!canEdit}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg disabled:bg-gray-50"
                  >
                    <option>Comfortaa</option>
                    <option>Georgia</option>
                    <option>Times New Roman</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-black mb-2">
                    Body Font
                  </label>
                  <select
                    value={theme.typography.bodyFont}
                    onChange={(e) =>
                      handleTypographyChange("bodyFont", e.target.value)
                    }
                    disabled={!canEdit}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg disabled:bg-gray-50"
                  >
                    <option>Inter</option>
                    <option>Arial</option>
                    <option>Helvetica</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-2">
                    Heading Size
                  </label>
                  <input
                    type="text"
                    value={theme.typography.headingSize}
                    onChange={(e) =>
                      handleTypographyChange("headingSize", e.target.value)
                    }
                    disabled={!canEdit}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-black mb-2">
                    Body Size
                  </label>
                  <input
                    type="text"
                    value={theme.typography.bodySize}
                    onChange={(e) =>
                      handleTypographyChange("bodySize", e.target.value)
                    }
                    disabled={!canEdit}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-h4 font-bold text-brand-black mb-4">
              Branding
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={theme.branding.brandName}
                  onChange={(e) =>
                    setTheme({
                      ...theme,
                      branding: {
                        ...theme.branding,
                        brandName: e.target.value,
                      },
                    })
                  }
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={theme.branding.logoUrl}
                  onChange={(e) =>
                    setTheme({
                      ...theme,
                      branding: { ...theme.branding, logoUrl: e.target.value },
                    })
                  }
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Save Buttons */}
          {canEdit && (
            <div className="flex gap-3">
              <Button
                onClick={handleSaveTheme}
                disabled={!hasChanges}
                size="lg"
                variant="default"
                className="flex-1"
              >
                <Save className="h-4 w-4" />
                Save Theme
              </Button>
              <Button
                onClick={handleResetTheme}
                size="lg"
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          )}
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-2 border-gray-200 rounded-2xl p-6 sticky top-20 h-fit"
        >
          <h3 className="text-h4 font-bold text-brand-black mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5 text-brand-orange" />
            Preview
          </h3>

          {/* Color Swatches */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-600 uppercase">
              Colors
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(theme.colors).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div
                    className="w-full h-12 rounded-lg border-2 border-gray-200"
                    style={{ backgroundColor: value }}
                  ></div>
                  <p className="text-xs text-gray-600 capitalize">{key}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Preview */}
          <div className="mt-6 space-y-3 pt-6 border-t-2 border-gray-100">
            <p className="text-xs font-semibold text-gray-600 uppercase">
              Typography
            </p>
            <div
              style={{
                fontFamily: theme.typography.headingFont,
                fontSize: theme.typography.headingSize,
                color: theme.colors.text,
              }}
              className="font-bold"
            >
              Heading
            </div>
            <div
              style={{
                fontFamily: theme.typography.bodyFont,
                fontSize: theme.typography.bodySize,
                color: theme.colors.lightText,
              }}
            >
              Body text example
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
