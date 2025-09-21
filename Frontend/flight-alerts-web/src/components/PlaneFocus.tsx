import React, { useRef, useEffect, ReactNode } from "react";
/*
    children: What I want to be displayed above this background
    imageUrl: Optional, can use this to change the background image
    blurAmount: Optional (default = 14), Controls the amount the image is blurred
    focusRadius: Optional (default = 140), Controls the radius around the cursor where the image focuses
    transitionMs: Optional (default = 200), Controls the time before the blur comes back
*/
type Props = {
  children: ReactNode;
  imageUrl?: string;
  blurAmount?: number;
  focusRadius?: number;
  transitionMs?: number;
};

export default function PlaneFocusBackground({
  children,
  imageUrl = "/images/plane.jpg",
  blurAmount = 14,
  focusRadius = 140,
  transitionMs = 200,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const revealRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const reveal = revealRef.current;
    if (!wrapper || !reveal) {
      return;
    }

    let rect: DOMRect | null = null;

    /*
        Function to update the area around the mouse to be focused
    */
    function updateClip(x: number, y: number, radius = focusRadius) {
      if (!wrapper || !reveal) {
        return;
      }
      if (!rect) {
        rect = wrapper.getBoundingClientRect();
      }
      const localX = x - rect.left;
      const localY = y - rect.top;
      const clip = `circle(${radius}px at ${localX}px ${localY}px)`;
      reveal.style.clipPath = clip;
      reveal.style.setProperty("-webkit-clip-path", clip);
    }

    /*
        Calls updateClip every mouse move
    */
    function handleMove(e: MouseEvent) {
      updateClip(e.clientX, e.clientY);
    }

    /*
        When the user first moves the mouse into the wrapper div
    */
    function handleEnter(e: MouseEvent) {
      if (!reveal) {
        return;
      }
      reveal.style.transition = `clip-path ${transitionMs}ms ease`;
      handleMove(e);
      reveal.style.opacity = "1";
    }
    /*
        When the user moves the mouse out of the wrapper div
    */
    function handleLeave() {
      if (!reveal) {
        return;
      }
      reveal.style.transition = `clip-path ${transitionMs}ms ease, opacity ${transitionMs}ms ease`;
      reveal.style.clipPath = `circle(0px at 50% 50%)`;
      reveal.style.opacity = "0";
    }
    wrapper.addEventListener("mousemove", handleMove);
    wrapper.addEventListener("mouseenter", handleEnter);
    wrapper.addEventListener("mouseleave", handleLeave);

    reveal.style.clipPath = `circle(0px at 50% 50%)`;
    reveal.style.opacity = "0";

    return () => {
      wrapper.removeEventListener("mousemove", handleMove);
      wrapper.removeEventListener("mouseenter", handleEnter);
      wrapper.removeEventListener("mouseleave", handleLeave);
    };
  }, [focusRadius, transitionMs]);
  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: `blur(${blurAmount}px)`,
          transform: "scale(1.04)",
        }}
      />
      <div
        ref={revealRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "none",
          clipPath: `circle(0px at 50% 50%)`,
          WebkitClipPath: `circle(0px at 50% 50%)`,
          pointerEvents: "none",
          transition: `all ${transitionMs}ms ease`,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}
