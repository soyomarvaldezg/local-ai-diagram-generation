import { useState } from "react";
import {
  Download,
  Image,
  FileCode,
  FileJson,
  Copy,
  FileType,
  X,
} from "lucide-react";
import {
  exportToPNG,
  exportToSVG,
  exportToMermaid,
  exportToJSON,
  exportToDrawIO,
  copyToClipboard,
  downloadTextFile,
} from "../services/exportService";

function ExportMenu({
  isOpen,
  onClose,
  nodes,
  edges,
  prompt,
  reactFlowInstance,
}) {
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);

  if (!isOpen) return null;

  const handleExport = async (type) => {
    setExporting(true);
    setExportStatus(null);

    try {
      switch (type) {
        case "png":
          await exportToPNG(reactFlowInstance, "diagram.png");
          setExportStatus({ type: "success", message: "PNG exported!" });
          break;

        case "svg":
          await exportToSVG(reactFlowInstance, "diagram.svg");
          setExportStatus({ type: "success", message: "SVG exported!" });
          break;

        case "mermaid":
          const mermaidCode = exportToMermaid(nodes, edges);
          downloadTextFile(mermaidCode, "diagram.mmd", "text/plain");
          setExportStatus({
            type: "success",
            message: "Mermaid code exported!",
          });
          break;

        case "mermaid-copy":
          const mermaidCopy = exportToMermaid(nodes, edges);
          await copyToClipboard(mermaidCopy);
          setExportStatus({ type: "success", message: "Mermaid code copied!" });
          break;

        case "json":
          const jsonData = exportToJSON(nodes, edges, prompt);
          downloadTextFile(jsonData, "diagram.json", "application/json");
          setExportStatus({ type: "success", message: "JSON exported!" });
          break;

        case "drawio":
          const drawioXml = exportToDrawIO(nodes, edges);
          downloadTextFile(drawioXml, "diagram.drawio", "application/xml");
          setExportStatus({
            type: "success",
            message: "Draw.io file exported!",
          });
          break;

        default:
          throw new Error("Unknown export type");
      }

      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      console.error("Export error:", error);
      setExportStatus({
        type: "error",
        message: error.message || "Export failed",
      });
      setTimeout(() => setExportStatus(null), 5000);
    } finally {
      setExporting(false);
    }
  };

  const exportOptions = [
    {
      id: "png",
      label: "Export as PNG",
      description: "High-quality raster image",
      icon: Image,
      color: "#10b981",
    },
    {
      id: "svg",
      label: "Export as SVG",
      description: "Scalable vector graphics",
      icon: FileCode,
      color: "#3b82f6",
    },
    {
      id: "mermaid",
      label: "Export Mermaid Code",
      description: "Download .mmd file",
      icon: FileType,
      color: "#8b5cf6",
    },
    {
      id: "mermaid-copy",
      label: "Copy Mermaid Code",
      description: "Copy to clipboard",
      icon: Copy,
      color: "#6366f1",
    },
    {
      id: "json",
      label: "Export as JSON",
      description: "Structured data format",
      icon: FileJson,
      color: "#f59e0b",
    },
    {
      id: "drawio",
      label: "Export to Draw.io",
      description: "Open in diagrams.net",
      icon: Download,
      color: "#ec4899",
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download size={24} />
            <div>
              <h2 className="text-xl font-bold">Export Diagram</h2>
              <p className="text-sm text-white/80">
                Choose your preferred format
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Status Message */}
        {exportStatus && (
          <div
            className={`mx-6 mt-4 px-4 py-3 rounded-lg ${
              exportStatus.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {exportStatus.message}
          </div>
        )}

        {/* Export Options */}
        <div className="p-6 space-y-3">
          {exportOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => handleExport(option.id)}
                disabled={exporting}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-lg"
                  style={{ backgroundColor: `${option.color}20` }}
                >
                  <IconComponent
                    size={24}
                    color={option.color}
                    strokeWidth={2}
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {option.description}
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-blue-600">
                  <Download size={20} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              💡 <span className="font-medium">Tip:</span> Draw.io files can be
              opened at{" "}
              <a
                href="https://app.diagrams.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                diagrams.net
              </a>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportMenu;
