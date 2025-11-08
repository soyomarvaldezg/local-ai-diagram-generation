import dagre from "dagre";

export function mermaidToReactFlow(mermaidCode) {
  const lines = mermaidCode.split("\n").filter((line) => {
    const trimmed = line.trim();
    // Filter out graph declarations and empty lines
    return (
      trimmed &&
      !trimmed.startsWith("graph") &&
      !trimmed.startsWith("%%") && // Remove comments
      trimmed.length > 0
    );
  });

  const nodes = [];
  const edges = [];
  const nodeMap = new Map();

  lines.forEach((line) => {
    // Match arrows: --> or --- or ->
    const edgeMatch = line.match(
      /(\w+)(?:\[([^\]]+)\])?\s*(?:-->|---|->)\s*(\w+)(?:\[([^\]]+)\])?/,
    );

    if (edgeMatch) {
      const [, sourceId, sourceLabel, targetId, targetLabel] = edgeMatch;

      if (!nodeMap.has(sourceId)) {
        nodeMap.set(sourceId, {
          id: sourceId,
          data: { label: sourceLabel || sourceId },
          position: { x: 0, y: 0 },
          type: "default",
          style: {
            background: "#fff",
            border: "2px solid #3b82f6",
            borderRadius: "8px",
            padding: "10px",
            fontSize: "14px",
            fontWeight: "500",
          },
        });
      }

      if (!nodeMap.has(targetId)) {
        nodeMap.set(targetId, {
          id: targetId,
          data: { label: targetLabel || targetId },
          position: { x: 0, y: 0 },
          type: "default",
          style: {
            background: "#fff",
            border: "2px solid #3b82f6",
            borderRadius: "8px",
            padding: "10px",
            fontSize: "14px",
            fontWeight: "500",
          },
        });
      }

      edges.push({
        id: `e-${sourceId}-${targetId}-${edges.length}`,
        source: sourceId,
        target: targetId,
        animated: true,
        style: {
          stroke: "#3b82f6",
          strokeWidth: 2,
        },
        markerEnd: {
          type: "arrowclosed",
          color: "#3b82f6",
        },
      });
    }
  });

  nodeMap.forEach((node) => nodes.push(node));

  if (nodes.length === 0) {
    return {
      nodes: [
        {
          id: "error",
          data: { label: "Failed to parse diagram" },
          position: { x: 250, y: 100 },
        },
      ],
      edges: [],
    };
  }

  const layoutedElements = getLayoutedElements(nodes, edges);

  return layoutedElements;
}

function getLayoutedElements(nodes, edges) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: "LR",
    nodesep: 100,
    ranksep: 100,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const pos = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - 100,
        y: pos.y - 40,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
