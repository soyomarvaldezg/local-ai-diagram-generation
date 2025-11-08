import { toPng, toSvg } from "html-to-image";
import { getNodesBounds, getViewportForBounds } from "reactflow";

/**
 * Export diagram as PNG image
 */
export async function exportToPNG(reactFlowInstance, filename = "diagram.png") {
  try {
    // Hide particles and temporarily change edge styles
    const particles = document.querySelectorAll(
      ".edge-particle, .edge-particle-glow",
    );
    particles.forEach((p) => (p.style.display = "none"));

    // Get all edge paths and store/modify their styles
    const edgePaths = document.querySelectorAll(".react-flow__edge-path");
    const originalStyles = [];

    edgePaths.forEach((path, index) => {
      originalStyles[index] = {
        stroke: path.style.stroke,
        strokeDasharray: path.style.strokeDasharray,
        animation: path.style.animation,
      };

      // Get the edge color from the stroke attribute or computed style
      const currentStroke =
        path.getAttribute("stroke") ||
        window.getComputedStyle(path).stroke ||
        "#3b82f6";

      // Apply clean dashed style with proper color
      path.style.stroke = currentStroke;
      path.style.strokeDasharray = "5,5";
      path.style.animation = "none";
    });

    const nodesBounds = getNodesBounds(reactFlowInstance.getNodes());
    const viewport = getViewportForBounds(nodesBounds, 1200, 800, 0.5, 2, 0.2);

    // Wait for styles to apply
    await new Promise((resolve) => setTimeout(resolve, 100));

    const viewportElement = document.querySelector(".react-flow__viewport");

    const dataUrl = await toPng(viewportElement, {
      backgroundColor: "#f9fafb",
      width: 1200,
      height: 800,
      style: {
        width: "1200px",
        height: "800px",
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
      pixelRatio: 2,
      filter: (node) => {
        // Filter out particle elements and controls
        if (node.classList) {
          return (
            !node.classList.contains("edge-particle") &&
            !node.classList.contains("edge-particle-glow") &&
            !node.classList.contains("react-flow__controls") &&
            !node.classList.contains("react-flow__minimap")
          );
        }
        return true;
      },
    });

    // Restore original styles
    edgePaths.forEach((path, index) => {
      path.style.stroke = originalStyles[index].stroke;
      path.style.strokeDasharray = originalStyles[index].strokeDasharray;
      path.style.animation = originalStyles[index].animation;
    });

    // Restore particles
    particles.forEach((p) => (p.style.display = ""));

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();

    return { success: true };
  } catch (error) {
    console.error("PNG export error:", error);
    // Restore everything on error
    const particles = document.querySelectorAll(
      ".edge-particle, .edge-particle-glow",
    );
    particles.forEach((p) => (p.style.display = ""));
    throw new Error("Failed to export PNG");
  }
}

/**
 * Export diagram as SVG image
 */
export async function exportToSVG(reactFlowInstance, filename = "diagram.svg") {
  try {
    // Hide particles and temporarily change edge styles
    const particles = document.querySelectorAll(
      ".edge-particle, .edge-particle-glow",
    );
    particles.forEach((p) => (p.style.display = "none"));

    // Get all edge paths and store/modify their styles
    const edgePaths = document.querySelectorAll(".react-flow__edge-path");
    const originalStyles = [];

    edgePaths.forEach((path, index) => {
      originalStyles[index] = {
        stroke: path.style.stroke,
        strokeDasharray: path.style.strokeDasharray,
        animation: path.style.animation,
      };

      // Get the edge color
      const currentStroke =
        path.getAttribute("stroke") ||
        window.getComputedStyle(path).stroke ||
        "#3b82f6";

      // Apply clean dashed style
      path.style.stroke = currentStroke;
      path.style.strokeDasharray = "5,5";
      path.style.animation = "none";
    });

    const nodesBounds = getNodesBounds(reactFlowInstance.getNodes());
    const viewport = getViewportForBounds(nodesBounds, 1200, 800, 0.5, 2, 0.2);

    // Wait for styles to apply
    await new Promise((resolve) => setTimeout(resolve, 100));

    const viewportElement = document.querySelector(".react-flow__viewport");

    const dataUrl = await toSvg(viewportElement, {
      backgroundColor: "#f9fafb",
      width: 1200,
      height: 800,
      style: {
        width: "1200px",
        height: "800px",
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
      filter: (node) => {
        if (node.classList) {
          return (
            !node.classList.contains("edge-particle") &&
            !node.classList.contains("edge-particle-glow") &&
            !node.classList.contains("react-flow__controls") &&
            !node.classList.contains("react-flow__minimap")
          );
        }
        return true;
      },
    });

    // Restore original styles
    edgePaths.forEach((path, index) => {
      path.style.stroke = originalStyles[index].stroke;
      path.style.strokeDasharray = originalStyles[index].strokeDasharray;
      path.style.animation = originalStyles[index].animation;
    });

    // Restore particles
    particles.forEach((p) => (p.style.display = ""));

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();

    return { success: true };
  } catch (error) {
    console.error("SVG export error:", error);
    // Restore everything on error
    const particles = document.querySelectorAll(
      ".edge-particle, .edge-particle-glow",
    );
    particles.forEach((p) => (p.style.display = ""));
    throw new Error("Failed to export SVG");
  }
}

/**
 * Export to Mermaid code format
 */
export function exportToMermaid(nodes, edges) {
  let mermaidCode = "graph LR\n";

  // Create node definitions
  nodes.forEach((node) => {
    const label = node.data.label || node.id;
    mermaidCode += `  ${node.id}[${label}]\n`;
  });

  // Create edge definitions
  edges.forEach((edge) => {
    mermaidCode += `  ${edge.source} --> ${edge.target}\n`;
  });

  return mermaidCode;
}

/**
 * Export to JSON format
 */
export function exportToJSON(nodes, edges, prompt = "") {
  const data = {
    metadata: {
      version: "1.0",
      exported: new Date().toISOString(),
      prompt: prompt,
    },
    nodes: nodes.map((node) => ({
      id: node.id,
      label: node.data.label,
      category: node.data.category,
      color: node.data.iconColor,
      position: node.position,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
    })),
  };

  return JSON.stringify(data, null, 2);
}

/**
 * Export to Draw.io XML format
 */
export function exportToDrawIO(nodes, edges) {
  // Draw.io XML structure
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" modified="${new Date().toISOString()}" version="21.0.0">
  <diagram name="AI Generated Diagram" id="diagram1">
    <mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
`;

  // Add nodes
  nodes.forEach((node, index) => {
    const x = node.position.x;
    const y = node.position.y;
    const width = 180;
    const height = 80;
    const label = node.data.label || node.id;
    const color = node.data.iconColor || "#3b82f6";
    const category = node.data.category || "";

    // Convert hex color to Draw.io format
    const fillColor = color.replace("#", "");

    // Format label - replace \n with actual line break, or just show label without category
    const displayLabel = escapeXml(label);

    xml += `        <mxCell id="node_${node.id}" value="${displayLabel}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#${fillColor};strokeColor=#${fillColor};fontColor=#ffffff;fontSize=14;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/>
        </mxCell>
`;
  });

  // Add edges
  edges.forEach((edge, index) => {
    const sourceColor =
      nodes.find((n) => n.id === edge.source)?.data.iconColor || "#3b82f6";
    const strokeColor = sourceColor.replace("#", "");

    xml += `        <mxCell id="edge_${edge.id}" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#${strokeColor};strokeWidth=2;endArrow=classic;endFill=1;curved=0;" edge="1" parent="1" source="node_${edge.source}" target="node_${edge.target}">
          <mxGeometry relative="1" as="geometry">
            <Array as="points"/>
          </mxGeometry>
        </mxCell>
`;
  });

  xml += `      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

  return xml;
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text, format = "text") {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true, format };
  } catch (error) {
    console.error("Clipboard error:", error);
    throw new Error("Failed to copy to clipboard");
  }
}

/**
 * Download text file
 */
export function downloadTextFile(content, filename, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Helper to escape XML special characters
 */
function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
