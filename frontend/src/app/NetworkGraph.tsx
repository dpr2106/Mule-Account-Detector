"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import ForceGraph2D with SSR disabled
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

export default function NetworkGraph() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const fgRef = useRef<any>(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/network-graph");
        if (response.ok) {
          const data = await response.json();
          setGraphData(data);
        }
      } catch (error) {
        console.error("Failed to fetch graph data:", error);
      }
    };

    fetchGraph();
    const interval = setInterval(fetchGraph, 2000); // Poll graph every 2s
    return () => clearInterval(interval);
  }, []);

  // Tweak the physics engine so nodes repel each other more and don't clump
  useEffect(() => {
    if (fgRef.current) {
      // Negative strength pushes nodes further apart
      fgRef.current.d3Force('charge').strength(-200);
      fgRef.current.d3Force('link').distance(60);
    }
  }, [graphData]);

  return (
    <div className="w-full h-[400px] bg-black rounded-xl overflow-hidden border border-zinc-800/50 relative">
      {/* Absolute overlay for styling */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-zinc-200 font-semibold text-sm uppercase tracking-wider">Topology Analysis</h3>
        <p className="text-xs text-zinc-400">Node: Account | Edge: Transaction</p>
      </div>

      {typeof window !== "undefined" && (
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          width={800} // Approximate, you might want to use a ref to get parent width
          height={400}
          nodeAutoColorBy="group"
          nodeColor={(node: any) => (node.group === 1 ? "#ec4899" : "#84cc16")} // Pink for mules, Lime for normal
          linkColor={(link: any) => "rgba(100, 116, 139, 0.3)"} // zinc-500 with opacity
          nodeRelSize={4}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={(d: any) => d.value * 0.001}
          linkWidth={1}
          onNodeClick={(node: any) => {
            // Center the camera on the clicked node
            if (fgRef.current) {
              fgRef.current.centerAt(node.x, node.y, 1000);
              fgRef.current.zoom(8, 2000);
            }
          }}
          onNodeDragEnd={(node: any) => {
            // Pin the node in place after dragging
            node.fx = node.x;
            node.fy = node.y;
          }}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.id;
            const isMaster = label.includes("MASTER");
            const isMule = node.group === 1;
            
            // Draw circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
            ctx.fillStyle = isMule ? "#ec4899" : "#84cc16";
            ctx.fill();
            
            // Highlight Master Mules with a white ring
            if (isMaster) {
              ctx.lineWidth = 2 / globalScale;
              ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
              ctx.stroke();
            }

            // Only draw text if we are zoomed in, OR if it is a Master Mule
            // This prevents the massive white blob of text from overlapping
            if (globalScale >= 3 || isMaster) {
              const fontSize = isMaster ? 16 / globalScale : 10 / globalScale;
              ctx.font = `${isMaster ? 'bold ' : ''}${fontSize}px Sans-Serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = isMaster ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.6)";
              ctx.fillText(label, node.x, node.y + node.val + (4/globalScale));
            }
          }}
        />
      )}
    </div>
  );
}
