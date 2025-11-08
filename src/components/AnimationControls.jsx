import { useState } from "react";
import { Sparkles, Play, Square, Settings, Zap } from "lucide-react";
import { ANIMATION_PRESETS } from "../services/animationService";

function AnimationControls({
  onAnimationChange,
  currentAnimation,
  onApplyAnimation,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const animations = [
    {
      ...ANIMATION_PRESETS.NONE,
      icon: Square,
      color: "#6b7280",
    },
    {
      ...ANIMATION_PRESETS.SEQUENTIAL_REVEAL,
      icon: Play,
      color: "#3b82f6",
    },
    {
      ...ANIMATION_PRESETS.FLOW_PARTICLES,
      icon: Zap,
      color: "#10b981",
    },
    {
      ...ANIMATION_PRESETS.FLOW_ANIMATION,
      icon: Play,
      color: "#06b6d4",
    },
    {
      ...ANIMATION_PRESETS.HIGHLIGHT_PATH,
      icon: Sparkles,
      color: "#ec4899",
    },
    {
      ...ANIMATION_PRESETS.COMBO_FLOW_HIGHLIGHT,
      icon: Zap,
      color: "#f59e0b",
    },
    {
      ...ANIMATION_PRESETS.COMBO_ALL,
      icon: Zap,
      color: "#ef4444",
    },
  ];

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white shadow-lg rounded-lg p-3 hover:shadow-xl transition-shadow border border-gray-200 flex items-center gap-2"
        title="Animation Settings"
      >
        <Sparkles size={20} className="text-purple-600" />
        <span className="text-sm font-medium text-gray-700">Animations</span>
      </button>

      {/* Animation Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Settings size={18} />
              Animation Style
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {animations.map((animation) => {
              const IconComponent = animation.icon;
              const isActive = currentAnimation === animation.id;

              return (
                <button
                  key={animation.id}
                  onClick={() => {
                    onAnimationChange(animation.id);
                    if (onApplyAnimation) {
                      onApplyAnimation(animation.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-50 border-2 border-blue-400"
                      : "bg-gray-50 border-2 border-transparent hover:border-gray-300"
                  }`}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg"
                    style={{ backgroundColor: `${animation.color}20` }}
                  >
                    <IconComponent size={20} color={animation.color} />
                  </div>
                  <div className="flex-1 text-left">
                    <div
                      className={`font-medium ${isActive ? "text-blue-700" : "text-gray-900"}`}
                    >
                      {animation.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {animation.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="text-blue-600">
                      <Play size={16} fill="currentColor" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Zap size={12} className="text-yellow-500" />
              Animations apply instantly when you click
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnimationControls;
