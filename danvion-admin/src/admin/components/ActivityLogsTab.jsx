import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { History, Download, Trash2, Filter, RotateCcw } from "lucide-react";
import Button from "../../components/ui/Button";

export default function ActivityLogsTab() {
  const audit = useSelector((state) => state.audit);

  // Memoize logs to maintain stable reference across renders
  const logs = useMemo(() => {
    return audit?.logs || [];
  }, [audit?.logs]);

  const [filterSection, setFilterSection] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [filterEmail, setFilterEmail] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique values for filters
  const sections = useMemo(() => {
    const unique = new Set(logs.map((log) => log.section));
    return ["all", ...Array.from(unique).sort()];
  }, [logs]);

  const actions = useMemo(() => {
    const unique = new Set(logs.map((log) => log.action));
    return ["all", ...Array.from(unique).sort()];
  }, [logs]);

  const emails = useMemo(() => {
    const unique = new Set(logs.map((log) => log.adminEmail));
    return ["all", ...Array.from(unique).sort()];
  }, [logs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSection = filterSection === "all" || log.section === filterSection;
      const matchAction = filterAction === "all" || log.action === filterAction;
      const matchEmail = filterEmail === "all" || log.adminEmail === filterEmail;
      const matchSearch =
        searchTerm === "" ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.adminEmail.toLowerCase().includes(searchTerm.toLowerCase());

      return matchSection && matchAction && matchEmail && matchSearch;
    });
  }, [logs, filterSection, filterAction, filterEmail, searchTerm]);

  const handleExportLogs = () => {
    const csv = [
      ["Timestamp", "Admin", "Role", "Action", "Section", "Item", "Status", "Description"],
      ...filteredLogs.map((log) => [
        new Date(log.timestamp).toLocaleString(),
        log.adminEmail,
        log.adminRole,
        log.action,
        log.section,
        log.itemName || "-",
        log.status,
        log.description,
      ]),
    ]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `activity-logs-${new Date().toISOString().split("T")[0]}.csv`);
    link.click();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "create":
        return "text-blue-600";
      case "update":
        return "text-orange-600";
      case "delete":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <History className="h-6 w-6 text-brand-orange" />
            <h2 className="text-h3 font-bold text-brand-black">Activity Logs</h2>
          </div>
          <p className="text-gray-600">
            Track all admin activities for accountability and debugging
          </p>
        </div>
        <Button onClick={handleExportLogs} size="lg" variant="default">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-50 to-white border-2 border-orange-200 rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-brand-orange" />
          <h3 className="text-h4 font-bold text-brand-black">Filters</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search logs..."
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none text-sm"
          />

          {/* Section Filter */}
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none text-sm"
          >
            {sections.map((section) => (
              <option key={section} value={section}>
                {section === "all" ? "All Sections" : section}
              </option>
            ))}
          </select>

          {/* Action Filter */}
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none text-sm"
          >
            {actions.map((action) => (
              <option key={action} value={action}>
                {action === "all" ? "All Actions" : action}
              </option>
            ))}
          </select>

          {/* Email Filter */}
          <select
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-orange focus:outline-none text-sm"
          >
            {emails.map((email) => (
              <option key={email} value={email}>
                {email === "all" ? "All Admins" : email}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          <Button
            onClick={() => {
              setFilterSection("all");
              setFilterAction("all");
              setFilterEmail("all");
              setSearchTerm("");
            }}
            size="md"
            variant="outline"
          >
            <RotateCcw className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>

        <p className="text-sm text-gray-600">
          Showing <strong>{filteredLogs.length}</strong> of <strong>{logs.length}</strong> logs
        </p>
      </motion.div>

      {/* Logs Table */}
      {filteredLogs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-gray-50 rounded-2xl"
        >
          <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">No activity logs found</p>
          <p className="text-gray-500 text-sm mt-1">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "Admin activities will appear here"}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-x-auto border-2 border-gray-200 rounded-2xl"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left font-bold text-brand-black">Timestamp</th>
                <th className="px-6 py-4 text-left font-bold text-brand-black">Admin</th>
                <th className="px-6 py-4 text-left font-bold text-brand-black">Action</th>
                <th className="px-6 py-4 text-left font-bold text-brand-black">Section</th>
                <th className="px-6 py-4 text-left font-bold text-brand-black">Item</th>
                <th className="px-6 py-4 text-left font-bold text-brand-black">Status</th>
                <th className="px-6 py-4 text-left font-bold text-brand-black">Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-600">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">{log.adminEmail}</p>
                      <p className="text-xs text-gray-500 capitalize">{log.adminRole}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold capitalize ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold capitalize">
                      {log.section}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">{log.itemName || "-"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div>
                      <p>{log.description}</p>
                      {log.errorMessage && (
                        <p className="text-red-600 text-xs mt-1">Error: {log.errorMessage}</p>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}
