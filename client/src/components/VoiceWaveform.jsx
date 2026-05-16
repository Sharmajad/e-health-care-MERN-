import React, { useEffect, useRef } from 'react';

const VoiceWaveform = ({ isSpeaking = true, isMuted = false }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const barCount = 40;
    const bars = [];
    
    // Initialize bars
    for (let i = 0; i < barCount; i++) {
      bars.push({
        x: 0,
        height: 10,
        targetHeight: 10,
        amplitude: Math.random() * 0.5 + 0.5,
      });
    }

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const animate = (time) => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const spacing = (canvas.width / barCount);
      const barWidth = spacing * 0.6;

      for (let i = 0; i < barCount; i++) {
        const bar = bars[i];
        
        if (isMuted) {
          bar.targetHeight = 4;
        } else if (isSpeaking) {
          // Dynamic speaking motion
          const noise = Math.sin(time * 0.01 + i * 0.2) * 20;
          const peak = Math.sin(time * 0.005 + i * 0.5) * 40 * bar.amplitude;
          bar.targetHeight = 15 + Math.abs(peak) + Math.abs(noise);
        } else {
          // Idle breathing motion
          bar.targetHeight = 8 + Math.sin(time * 0.002 + i * 0.3) * 6;
        }

        // Smooth transition
        bar.height += (bar.targetHeight - bar.height) * 0.15;

        // Draw symmetrical waveform
        const x = spacing * i;
        const gradient = ctx.createLinearGradient(0, centerY - bar.height, 0, centerY + bar.height);
        gradient.addColorStop(0, 'rgba(34, 211, 238, 0)');
        gradient.addColorStop(0.5, isMuted ? 'rgba(156, 163, 175, 0.5)' : 'rgba(59, 130, 246, 0.8)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.fillStyle = gradient;
        
        // Rounded rect for bars
        const r = barWidth / 2;
        const y = centerY - bar.height;
        const h = bar.height * 2;
        
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, h, [r]);
        } else {
          ctx.rect(x, y, barWidth, h);
        }
        ctx.fill();
        
        // Add a soft glow point in the middle
        if (!isMuted) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = 'rgba(34, 211, 238, 0.4)';
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isSpeaking, isMuted]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full opacity-80"
      style={{ filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.2))' }}
    />
  );
};

export default VoiceWaveform;
