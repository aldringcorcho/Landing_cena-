"use client";

import { useEffect, useRef } from "react";

// Vídeo de la vela del hero. Si la persona prefiere menos movimiento, se queda en su primera imagen.
export default function VideoVela() {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (video.current && matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.current.pause();
    }
  }, []);

  return (
    <video
      ref={video}
      className="video-vela"
      src="/videos/vela.webm"
      poster="/videos/vela-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
}
