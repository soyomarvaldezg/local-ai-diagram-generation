import { getBezierPath } from "reactflow";

function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const color = style.stroke || "#3b82f6";
  const particleDelay = data?.particleDelay || 0;

  return (
    <>
      {/* The edge path with dashed animation */}
      <path
        id={id}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeDasharray="5,5"
        style={{
          animation: "flowDash 1s linear infinite",
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />

      {/* Animated particle (circle) */}
      <circle r="6" fill={color} className="edge-particle">
        <animateMotion
          dur={`${4 + particleDelay}s`}
          repeatCount="indefinite"
          begin={`${particleDelay}s`}
        >
          <mpath href={`#${id}`} />
        </animateMotion>

        {/* Pulsing glow effect */}
        <animate
          attributeName="r"
          values="4;7;4"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Particle glow/shadow */}
      <circle r="10" fill={color} opacity="0.3" className="edge-particle-glow">
        <animateMotion
          dur={`${4 + particleDelay}s`}
          repeatCount="indefinite"
          begin={`${particleDelay}s`}
        >
          <mpath href={`#${id}`} />
        </animateMotion>
      </circle>
    </>
  );
}

export default AnimatedEdge;
