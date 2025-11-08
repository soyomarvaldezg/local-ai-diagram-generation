import dagre from "dagre";
import { getIconForLabel } from "./iconMapping";

export function mermaidToReactFlow(mermaidCode) {
  const lines = mermaidCode.split("\n").filter((line) => {
    const trimmed = line.trim();
    return (
      trimmed &&
      !trimmed.startsWith("graph") &&
      !trimmed.startsWith("%%") &&
      trimmed.length > 0
    );
  });

  const nodes = [];
  const edges = [];
  const nodeMap = new Map();

  lines.forEach((line) => {
    const edgeMatch = line.match(
      /(\w+)(?:\[([^\]]+)\])?\s*(?:-->|---|->)\s*(\w+)(?:\[([^\]]+)\])?/,
    );

    if (edgeMatch) {
      const [, sourceId, sourceLabel, targetId, targetLabel] = edgeMatch;

      if (!nodeMap.has(sourceId)) {
        const label = sourceLabel || sourceId;
        const iconData = getIconForLabel(label);

        nodeMap.set(sourceId, {
          id: sourceId,
          type: "custom",
          data: {
            label: label,
            icon: iconData.icon,
            iconColor: iconData.color,
            category: iconData.category,
          },
          position: { x: 0, y: 0 },
        });
      }

      if (!nodeMap.has(targetId)) {
        const label = targetLabel || targetId;
        const iconData = getIconForLabel(label);

        nodeMap.set(targetId, {
          id: targetId,
          type: "custom",
          data: {
            label: label,
            icon: iconData.icon,
            iconColor: iconData.color,
            category: iconData.category,
          },
          position: { x: 0, y: 0 },
        });
      }

      const sourceIconData = nodeMap.get(sourceId).data;
      edges.push({
        id: `e-${sourceId}-${targetId}-${edges.length}`,
        source: sourceId,
        target: targetId,
        animated: true,
        style: {
          stroke: sourceIconData.iconColor,
          strokeWidth: 2,
        },
        markerEnd: {
          type: "arrowclosed",
          color: sourceIconData.iconColor,
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
          type: "custom",
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
    nodesep: 120,
    ranksep: 150,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 220, height: 90 });
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
        x: pos.x - 110,
        y: pos.y - 45,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
