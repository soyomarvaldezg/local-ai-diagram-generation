/**
 * Animation system with real moving particles
 */

/**
 * Apply particle animation to edges with staggered timing
 */
export function applyParticleAnimation(edges) {
  return edges.map((edge, index) => {
    // Preserve the original edge color
    const edgeColor = edge.style?.stroke || edge.markerEnd?.color || "#3b82f6";

    return {
      ...edge,
      type: "animated", // Use our custom animated edge
      animated: true,
      data: {
        ...edge.data,
        particleDelay: index * 0.6, // Stagger particles by 0.6s
      },
      style: {
        ...edge.style,
        stroke: edgeColor, // Ensure stroke color is explicitly set
        strokeWidth: 2,
      },
    };
  });
}

/**
 * Get CSS for animations
 */
export function getAnimationCSS() {
  return `
    /* Flowing dash animation */
    @keyframes flowDash {
      from {
        stroke-dashoffset: 10;
      }
      to {
        stroke-dashoffset: 0;
      }
    }

    /* Edge rendering */
    .react-flow__edge-path {
      stroke-width: 2px;
      transition: stroke-width 0.3s ease;
    }

    /* Particle styling */
    .edge-particle {
      filter: drop-shadow(0 0 8px currentColor);
    }

    .edge-particle-glow {
      filter: blur(4px);
    }
  `;
}

/**
 * Inject animation CSS
 */
export function injectAnimationCSS() {
  const styleId = "diagram-animations";

  const existing = document.getElementById(styleId);
  if (existing) {
    existing.remove();
  }

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = getAnimationCSS();
  document.head.appendChild(style);
}
