import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow,
} from "reactflow";
import CustomNode from "./CustomNode";
import AnimatedEdge from "./AnimatedEdge";
import ExportMenu from "./ExportMenu";

function DiagramCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  isExportMenuOpen,
  setIsExportMenuOpen,
  prompt,
}) {
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  const edgeTypes = useMemo(() => ({ animated: AnimatedEdge }), []);
  const reactFlowInstance = useReactFlow();

  return (
    <>
      {nodes.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-xl">Your diagram will appear here</p>
            <p className="text-sm mt-2">
              Describe your data architecture with voice or text
            </p>
            <p className="text-xs mt-4 text-gray-500">
              Supports: Databases, Warehouses, Lakes, Streaming, ETL, APIs, and
              more!
            </p>
          </div>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          attributionPosition="bottom-left"
          minZoom={0.1}
          maxZoom={4}
        >
          <Background color="#e5e7eb" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(node) => node.data.iconColor || "#3b82f6"}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        </ReactFlow>
      )}

      {/* Export Menu */}
      <ExportMenu
        isOpen={isExportMenuOpen}
        onClose={() => setIsExportMenuOpen(false)}
        nodes={nodes}
        edges={edges}
        prompt={prompt}
        reactFlowInstance={reactFlowInstance}
      />
    </>
  );
}

export default DiagramCanvas;
