import { useState, useRef, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { generateDiagram, transcribeAudio } from "./services/aiService";
import { mermaidToReactFlow } from "./services/mermaidParser";
import { getAvailableProviders } from "./services/providerConfig";

function App() {
  const [prompt, setPrompt] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("groq");
  const [availableProviders, setAvailableProviders] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const providers = getAvailableProviders();
    setAvailableProviders(providers);

    if (
      providers.length > 0 &&
      !providers.find((p) => p.id === selectedProvider)
    ) {
      setSelectedProvider(providers[0].id);
    }
  }, [selectedProvider]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await transcribeRecording(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      console.error("Microphone access error:", err);
      setError("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeRecording = async (audioBlob) => {
    setIsTranscribing(true);
    setError(null);

    try {
      const text = await transcribeAudio(audioBlob);
      // Append to existing text with a space
      setPrompt((prev) => (prev ? `${prev} ${text}` : text));
    } catch (err) {
      setError("Failed to transcribe audio. Please try again.");
      console.error(err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description or use the microphone");
      return;
    }

    if (availableProviders.length === 0) {
      setError(
        "No API keys configured. Please add at least one API key to .env file",
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Generating with ${selectedProvider}...`);
      const mermaidCode = await generateDiagram(prompt, selectedProvider);
      console.log("Generated Mermaid:", mermaidCode);

      const { nodes: newNodes, edges: newEdges } =
        mermaidToReactFlow(mermaidCode);

      if (newNodes.length === 0) {
        throw new Error("No diagram elements generated");
      }

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (err) {
      setError(
        `Failed to generate diagram with ${selectedProvider}. ${err.message}`,
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const clearDiagram = () => {
    setNodes([]);
    setEdges([]);
    setPrompt("");
    setError(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">🎨 AI Diagram Generator</h1>

            <div className="flex items-center gap-2">
              <span className="text-sm text-white/80">Provider:</span>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white font-medium focus:outline-none focus:bg-white/30 cursor-pointer backdrop-blur-sm"
                disabled={loading || isRecording || isTranscribing}
              >
                {availableProviders.map((provider) => (
                  <option
                    key={provider.id}
                    value={provider.id}
                    className="bg-gray-800 text-white"
                  >
                    {provider.icon} {provider.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {availableProviders.length > 0 && (
            <div className="text-white/70 text-xs mb-3">
              {
                availableProviders.find((p) => p.id === selectedProvider)
                  ?.description
              }
            </div>
          )}

          <div className="flex gap-2 mb-2">
            <div className="flex-1 relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your diagram in English or Spanish... (e.g., 'Create a data pipeline: MySQL → Dataflow → BigQuery')"
                className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white/40 backdrop-blur-sm resize-none"
                rows="2"
                disabled={isRecording || isTranscribing}
              />
              {isTranscribing && (
                <div className="absolute top-2 right-2 text-yellow-300 text-sm">
                  ✍️ Transcribing...
                </div>
              )}
            </div>

            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={loading || isTranscribing}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                  : "bg-white/20 hover:bg-white/30"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={
                isRecording
                  ? "Click to stop recording"
                  : "Click to start recording"
              }
            >
              {isRecording ? "⏹️ Stop" : "🎤 Record"}
            </button>

            <button
              onClick={handleGenerate}
              disabled={
                loading ||
                !prompt.trim() ||
                isRecording ||
                isTranscribing ||
                availableProviders.length === 0
              }
              className="px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "⏳ Generating..." : "✨ Generate"}
            </button>

            {nodes.length > 0 && (
              <button
                onClick={clearDiagram}
                disabled={isRecording || isTranscribing}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all disabled:opacity-50"
                title="Clear diagram"
              >
                🗑️ Clear
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-300 text-white px-4 py-2 rounded-lg">
              ⚠️ {error}
            </div>
          )}

          {availableProviders.length === 0 && (
            <div className="bg-yellow-500/20 border border-yellow-300 text-white px-4 py-2 rounded-lg">
              ⚠️ No API keys found. Please add at least one key via environment
              variables.
            </div>
          )}

          {!loading &&
            nodes.length === 0 &&
            !error &&
            !isRecording &&
            !isTranscribing &&
            availableProviders.length > 0 && (
              <div className="text-white/80 text-sm mt-2">
                💡 Try: "AWS architecture with ALB, EC2, and RDS" or click 🎤 to
                speak
              </div>
            )}
        </div>
      </div>

      <div className="flex-1 relative">
        {nodes.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-xl">Your diagram will appear here</p>
              <p className="text-sm mt-2">
                Type a description or use voice input (English/Spanish
                supported)
              </p>
              {availableProviders.length > 0 && (
                <p className="text-xs mt-4 text-gray-500">
                  Available providers:{" "}
                  {availableProviders
                    .map((p) => `${p.icon} ${p.name}`)
                    .join(", ")}
                </p>
              )}
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            attributionPosition="bottom-left"
            minZoom={0.1}
            maxZoom={4}
          >
            <Background color="#e5e7eb" gap={16} />
            <Controls />
            <MiniMap
              nodeColor={() => "#3b82f6"}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </ReactFlow>
        )}
      </div>
    </div>
  );
}

export default App;
