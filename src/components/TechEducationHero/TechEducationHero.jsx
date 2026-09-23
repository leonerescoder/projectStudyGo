import { useEffect, useRef } from "react";

export default function TechEducationHero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let width;
    let height;
    let nodes = [];
    let packets = [];

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const NODE_COUNT_DENSITY = 5200;
    const LINK_DIST = 165;
    const COLORS = {
      node: "rgba(96, 165, 250, 0.9)",
      nodeBright: "rgba(34, 211, 238, 1)",
      link: "rgba(96, 165, 250, 0.22)",
      packet: "rgba(224, 242, 254, 0.95)",
    };

    function spawnPacket() {
      const a = nodes[Math.floor(Math.random() * nodes.length)];
      const b = nodes[Math.floor(Math.random() * nodes.length)];
      return { a, b, t: Math.random() };
    }

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

      const count = Math.max(28, Math.floor((width * height) / NODE_COUNT_DENSITY));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() < 0.14 ? 2.8 : 1.5,
        bright: Math.random() < 0.14,
        pulse: Math.random() * Math.PI * 2,
      }));
      packets = Array.from({ length: Math.min(10, Math.floor(count / 5)) }, spawnPacket);
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        if (!prefersReducedMotion) {
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < 0 || a.x > width) a.vx *= -1;
          if (a.y < 0 || a.y > height) a.vy *= -1;
        }

        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < LINK_DIST) {
            ctx.strokeStyle = COLORS.link;
            ctx.globalAlpha = 1 - distance / LINK_DIST;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      for (const node of nodes) {
        if (!prefersReducedMotion) node.pulse += 0.03;
        const pulseScale = node.bright ? 1 + Math.sin(node.pulse) * 0.35 : 1;
        ctx.beginPath();
        ctx.fillStyle = node.bright ? COLORS.nodeBright : COLORS.node;
        ctx.shadowColor = node.bright ? COLORS.nodeBright : "transparent";
        ctx.shadowBlur = node.bright ? 10 : 0;
        ctx.arc(node.x, node.y, node.r * pulseScale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      for (let i = 0; i < packets.length; i += 1) {
        const packet = packets[i];
        if (!prefersReducedMotion) packet.t += 0.01;
        if (packet.t >= 1) packets[i] = spawnPacket();
        const pointX = packet.a.x + (packet.b.x - packet.a.x) * packet.t;
        const pointY = packet.a.y + (packet.b.y - packet.a.y) * packet.t;
        ctx.beginPath();
        ctx.fillStyle = COLORS.packet;
        ctx.shadowColor = COLORS.packet;
        ctx.shadowBlur = 6;
        ctx.arc(pointX, pointY, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      animationId = window.requestAnimationFrame(step);
    }

    resize();
    step();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="teh-root" aria-hidden="true">
      <div className="teh-gradient" />
      <canvas ref={canvasRef} className="teh-canvas" />
      <div className="teh-grid" />

      <svg className="teh-icon teh-icon--cap" viewBox="0 0 24 24" width="46" height="46">
        <path d="M12 3 1 8l11 5 9-4.09V17h2V8L12 3Z" fill="rgba(148,197,255,0.35)" />
        <path d="M5 10.18v3.64C5 16.1 8.13 18 12 18s7-1.9 7-4.18v-3.64L12 13 5 10.18Z" fill="rgba(148,197,255,0.35)" />
      </svg>
      <svg className="teh-icon teh-icon--book" viewBox="0 0 24 24" width="38" height="38">
        <path d="M4 5.5C4 4.67 4.67 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z" fill="rgba(103,232,249,0.3)" />
        <path d="M13 4h5.5c.83 0 1.5.67 1.5 1.5v13c0 .83-.67 1.5-1.5 1.5H13V4Z" fill="rgba(103,232,249,0.22)" />
      </svg>
      <svg className="teh-icon teh-icon--code" viewBox="0 0 24 24" width="40" height="40">
        <path d="M8.5 7 3.5 12l5 5 1.4-1.4L6.3 12l3.6-3.6L8.5 7Z" fill="rgba(148,197,255,0.32)" />
        <path d="M15.5 7 20.5 12l-5 5-1.4-1.4L17.7 12l-3.6-3.6L15.5 7Z" fill="rgba(148,197,255,0.32)" />
      </svg>
      <svg className="teh-icon teh-icon--bulb" viewBox="0 0 24 24" width="34" height="34">
        <path d="M9 21h6v-1H9v1Zm3-19a6 6 0 0 0-3.5 10.9c.6.45 1 1.2 1 2.1h5c0-.9.4-1.65 1-2.1A6 6 0 0 0 12 2Z" fill="rgba(103,232,249,0.3)" />
      </svg>
      <svg className="teh-icon teh-icon--chip" viewBox="0 0 24 24" width="36" height="36">
        <rect x="7" y="7" width="10" height="10" rx="1.5" fill="rgba(148,197,255,0.3)" />
        <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" stroke="rgba(148,197,255,0.32)" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </div>
  );
}
