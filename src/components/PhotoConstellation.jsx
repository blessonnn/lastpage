import React, { useEffect, useRef, useMemo } from 'react';

const IMAGES = [
  'abhinav.png', 'abhiraj.png', 'adil.png', 'akshara.png', 'amal.png',
  'anooja.png', 'aysha.png', 'bloppen.png', 'chemb.png', 'echiii.png', 'fidha.png',
  'gagna.png', 'gokool.png', 'gopi.png', 'hamda.png', 'lamiya.png',
  'leshman.png', 'liyakath.png', 'megha.png', 'mishal.png', 'muthu.png',
  'naseef.png', 'naseem.png', 'pacha.png', 'punni.png', 'riya.png',
  'saja.png', 'salman.png', 'shamila.png', 'siva.png', 'suttu.png',
  'vasu.png', 'vismaya.png', 'vivek.png', 'ziya.png'
];

const PhotoConstellation = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const imagesCachedRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const loadImages = async () => {
      const loadedImages = await Promise.all(
        IMAGES.map((src) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = `/frames/${src}`;
            img.onload = () => resolve(img);
          });
        })
      );
      imagesCachedRef.current = loadedImages;
      initParticles();
    };

    const initParticles = () => {
      const isMobile = window.innerWidth < 768;
      const cols = isMobile ? 4 : 6;
      const rows = isMobile ? 4 : 5;
      const cellWidth = canvas.width / cols;
      const cellHeight = canvas.height / rows;
      
      const particles = [];
      let imgIndex = 0;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Shuffle or pick images more diversely
          const img = imagesCachedRef.current[imgIndex % imagesCachedRef.current.length];
          imgIndex++;
          
          const aspectRatio = img.width / img.height;
          const size = Math.random() * 60 + 110; // Controlled size for better distribution
          
          // Jittered position within its grid cell
          const x = (c * cellWidth) + (Math.random() * (cellWidth * 0.8)) + (cellWidth * 0.1);
          const y = (r * cellHeight) + (Math.random() * (cellHeight * 0.8)) + (cellHeight * 0.1);

          particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 0.2, // Drifting slowly
            vy: (Math.random() - 0.5) * 0.2,
            w: size,
            h: size / aspectRatio,
            img: img,
            angle: 0, // No rotation as requested
            rotationSpeed: 0, // No rotation as requested
          });
        }
      }
      particlesRef.current = particles;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      const connectionLimit = 300;

      // Draw Lines
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionLimit) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = 1 - dist / connectionLimit;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.12})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw Particles
      particles.forEach((p) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.rotationSpeed;

        // Boundaries
        const margin = Math.max(p.w, p.h);
        if (p.x < -margin) p.x = canvas.width + margin;
        if (p.x > canvas.width + margin) p.x = -margin;
        if (p.y < -margin) p.y = canvas.height + margin;
        if (p.y > canvas.height + margin) p.y = -margin;

        // Draw Image
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        
        // Slightly rounded corners for "original shape" to keep it premium
        const r = 8;
        ctx.beginPath();
        ctx.moveTo(-p.w / 2 + r, -p.h / 2);
        ctx.lineTo(p.w / 2 - r, -p.h / 2);
        ctx.arcTo(p.w / 2, -p.h / 2, p.w / 2, -p.h / 2 + r, r);
        ctx.lineTo(p.w / 2, p.h / 2 - r);
        ctx.arcTo(p.w / 2, p.h / 2, p.w / 2 - r, p.h / 2, r);
        ctx.lineTo(-p.w / 2 + r, p.h / 2);
        ctx.arcTo(-p.w / 2, p.h / 2, -p.w / 2, p.h / 2 - r, r);
        ctx.lineTo(-p.w / 2, -p.h / 2 + r);
        ctx.arcTo(-p.w / 2, -p.h / 2, -p.w / 2 + r, -p.h / 2, r);
        ctx.closePath();
        ctx.clip();
        
        ctx.drawImage(p.img, -p.w / 2, -p.h / 2, p.w, p.h);
        
        // Subtle Border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    loadImages();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none opacity-60"
      style={{ filter: 'grayscale(0.2) contrast(1.1)' }}
    />
  );
};

export default PhotoConstellation;
