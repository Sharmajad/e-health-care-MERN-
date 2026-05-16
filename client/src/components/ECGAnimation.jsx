import React, { useEffect, useRef } from 'react';

const ECGAnimation = () => {
  const pathRef = useRef(null);

  useEffect(() => {
    let offset = 0;
    const animate = () => {
      offset -= 2;
      if (pathRef.current) {
        pathRef.current.style.transform = `translateX(${offset % 100}px)`;
      }
      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  // Simplified ECG pattern
  const ecgPath = "M 0 50 L 20 50 L 25 40 L 30 60 L 35 50 L 45 50 L 50 20 L 55 80 L 60 50 L 80 50 L 85 45 L 90 55 L 95 50 L 115 50";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        className="absolute top-1/2 -translate-y-1/2 w-full h-32"
      >
        <defs>
          <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <pattern id="ecgPattern" x="0" y="0" width="115" height="100" patternUnits="userSpaceOnUse">
            <path
              d={ecgPath}
              fill="none"
              stroke="url(#ecgGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </pattern>
        </defs>
        <rect ref={pathRef} x="-115" y="0" width="1230" height="100" fill="url(#ecgPattern)" />
      </svg>
    </div>
  );
};

export default ECGAnimation;
