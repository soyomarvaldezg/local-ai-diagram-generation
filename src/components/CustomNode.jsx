import { memo } from "react";
import { Handle, Position } from "reactflow";

function CustomNode({ data }) {
  const IconComponent = data.icon;
  const iconColor = data.iconColor || "#64748b";
  const label = data.label || "Node";

  return (
    <div
      style={{
        background: "#fff",
        border: `2px solid ${iconColor}`,
        borderRadius: "12px",
        padding: "16px",
        minWidth: "180px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: iconColor,
          width: "10px",
          height: "10px",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {IconComponent && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: `${iconColor}20`,
            }}
          >
            <IconComponent size={24} color={iconColor} strokeWidth={2} />
          </div>
        )}

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#1f2937",
              wordBreak: "break-word",
            }}
          >
            {label}
          </div>
          {data.category && (
            <div
              style={{
                fontSize: "10px",
                color: "#6b7280",
                marginTop: "2px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {data.category}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: iconColor,
          width: "10px",
          height: "10px",
        }}
      />
    </div>
  );
}

export default memo(CustomNode);
