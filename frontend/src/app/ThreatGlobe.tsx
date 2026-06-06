"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import react-globe.gl with SSR disabled
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function ThreatGlobe() {
  const globeEl = useRef<any>();
  const [arcsData, setArcsData] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchArcs = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/threat-map");
        if (response.ok) {
          const data = await response.json();
          setArcsData(data.arcs);
        }
      } catch (error) {
        console.error("Failed to fetch threat map data:", error);
      }
    };

    fetchArcs();
    const interval = setInterval(fetchArcs, 1000); // Poll every second
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Tweak globe initialization
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      // Focus on India / Asia region by default
      globeEl.current.pointOfView({ lat: 20, lng: 80, altitude: 2 }, 1000);
    }
  }, []);

  return (
    <div className="w-full h-[400px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700/50 relative flex items-center justify-center">
      {/* Absolute overlay for styling */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wider">Global Threat Map</h3>
        <p className="text-xs text-rose-500 font-medium mt-1">Showing Active Money Laundering Routes</p>
      </div>
      
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none text-right">
         <p className="text-xs text-slate-500">Only displaying flagged transactions (Risk &gt; 85%)</p>
      </div>

      {isMounted && (
        <Globe
          ref={globeEl}
          width={800} // Approximate width
          height={400}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          
          arcsData={arcsData}
          arcStartLat={(d: any) => d.startLat}
          arcStartLng={(d: any) => d.startLng}
          arcEndLat={(d: any) => d.endLat}
          arcEndLng={(d: any) => d.endLng}
          arcColor={(d: any) => d.color}
          arcStroke={1.5}
          arcsTransitionDuration={0}
        />
      )}
    </div>
  );
}
