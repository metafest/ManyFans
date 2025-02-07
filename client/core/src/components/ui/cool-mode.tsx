"use client";

import React, { ReactNode, useEffect, useRef, isValidElement } from "react";
import ReactDOMServer from 'react-dom/server';

export interface BaseParticle {
  element: HTMLElement | SVGSVGElement;
  left: number;
  size: number;
  top: number;
}

export interface BaseParticleOptions {
  particle?: string | ReactNode;
  size?: number;
}

export interface CoolParticle extends BaseParticle {
  direction: number;
  speedHorz: number;
  speedUp: number;
  spinSpeed: number;
  spinVal: number;
  isPaused: boolean;
  pauseStartTime: number;
}

export interface CoolParticleOptions extends BaseParticleOptions {
  particleCount?: number;
  speedHorz?: number;
  speedUp?: number;
}

const getContainer = () => {
  const id = "_coolMode_effect";
  let existingContainer = document.getElementById(id);

  if (existingContainer) {
    return existingContainer;
  }

  const container = document.createElement("div");
  container.setAttribute("id", id);
  container.setAttribute(
    "style",
    "overflow:hidden; position:fixed; height:100%; top:0; left:0; right:0; bottom:0; pointer-events:none; z-index:2147483647",
  );

  document.body.appendChild(container);

  return container;
};

const createParticleElement = (
  particleType: string | ReactNode,
  size: number
): HTMLElement => {
  const particle = document.createElement("div");

  if (typeof particleType === "string") {
    if (particleType === "circle") {
      const svgNS = "http://www.w3.org/2000/svg";
      const circleSVG = document.createElementNS(svgNS, "svg");
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttributeNS(null, "cx", (size / 2).toString());
      circle.setAttributeNS(null, "cy", (size / 2).toString());
      circle.setAttributeNS(null, "r", (size / 2).toString());
      circle.setAttributeNS(
        null,
        "fill",
        `hsl(${Math.random() * 360}, 70%, 50%)`,
      );

      circleSVG.appendChild(circle);
      circleSVG.setAttribute("width", size.toString());
      circleSVG.setAttribute("height", size.toString());

      particle.appendChild(circleSVG);
    } else {
      particle.innerHTML = `<img src="${particleType}" width="${size}" height="${size}" style="border-radius: 50%">`;
    }
  } else if (isValidElement(particleType)) {
    // Convert React component to string and insert as HTML
    const svgString = ReactDOMServer.renderToStaticMarkup(
      React.cloneElement(particleType as React.ReactElement, {
        // @ts-expect-error
        width: size,
        height: size,
        key: Math.random().toString(36).substring(7),
      })
    );
    particle.innerHTML = svgString;

    // Ensure SVG takes up the full space of the particle
    const svg = particle.querySelector('svg');
    if (svg) {
      svg.style.width = `${size}px`;
      svg.style.height = `${size}px`;
    }
  }

  return particle;
};

let instanceCounter = 0;

const applyParticleEffect = (
  element: HTMLElement,
  options?: CoolParticleOptions,
): (() => void) => {
  instanceCounter++;

  const defaultParticle = "circle";
  const particleType = options?.particle || defaultParticle;
  const sizes = [15, 20, 25, 35, 45];
  const limit = 45;

  let particles: CoolParticle[] = [];
  let autoAddParticle = false;
  let mouseX = 0;
  let mouseY = 0;

  const container = getContainer();

  function generateParticle() {
    const size =
      options?.size || sizes[Math.floor(Math.random() * sizes.length)];
    const speedHorz = options?.speedHorz || Math.random() * 10;
    const speedUp = options?.speedUp || Math.random() * 25;
    const spinVal = Math.random() * 6;
    const spinSpeed = Math.random() * 1 * (Math.random() <= 0.5 ? -1 : 1);
    const top = mouseY - size / 2;
    const left = mouseX - size / 2;
    const direction = Math.random() <= 0.5 ? -1 : 1;

    const particle = createParticleElement(particleType, size);
    particle.style.position = "absolute";
    // particle.style.transform = `translate3d(${left}px, ${top}px, 0px) rotate(${spinVal}deg)`;

    container.appendChild(particle);

    particles.push({
      direction,
      element: particle,
      left,
      size,
      speedHorz,
      speedUp,
      spinSpeed,
      spinVal,
      top,
      isPaused: false, // Add initial pause state
      pauseStartTime: 0, // Add initial pause timestamp
    });
  }

  function refreshParticles() {
    particles.forEach((p) => {
      // Update particle state
      if (!p.isPaused) {
        p.speedUp = Math.min(p.size, p.speedUp - 1);
        
        // Check if particle should enter pause state
        if (p.speedUp <= 0) {
          p.isPaused = true;
          p.pauseStartTime = Date.now();
        }
      } else {
        // Check if pause duration has elapsed
        if (Date.now() - p.pauseStartTime >= 25) {
          p.isPaused = false;
        }
      }
  
      // Update position and rotation only when not paused
      if (!p.isPaused) {
        p.left = p.left - p.speedHorz * p.direction;
        p.top = p.top - p.speedUp;
        p.spinVal += p.spinSpeed;
      }
  
      // Remove particles that fall off screen
      if (p.top >= Math.max(window.innerHeight, document.body.clientHeight) + p.size) {
        particles = particles.filter((o) => o !== p);
        p.element.remove();
      }
  
      // Update element style
      p.element.setAttribute(
        "style",
        [
          "position:absolute",
          `top:${p.top}px`,
          `left:${p.left}px`,
          `transform:rotate(${p.spinVal}deg)`,
        ].join(";")
      );
    });
  }

  let animationFrame: number | undefined;

  let lastParticleTimestamp = 0;
  const particleGenerationDelay = 300;

  function loop() {
    const currentTime = performance.now();
    if (
      autoAddParticle &&
      particles.length < limit &&
      currentTime - lastParticleTimestamp > particleGenerationDelay
    ) {
      generateParticle();
      lastParticleTimestamp = currentTime-100;
    }

    refreshParticles();
    animationFrame = requestAnimationFrame(loop);
  }

  loop();

  const isTouchInteraction = "ontouchstart" in window;

  const tap = isTouchInteraction ? "touchstart" : "mousedown";
  const tapEnd = isTouchInteraction ? "touchend" : "mouseup";
  const move = isTouchInteraction ? "touchmove" : "mousemove";

  const updateMousePosition = (e: MouseEvent | TouchEvent) => {
    if ("touches" in e) {
      mouseX = e.touches?.[0].clientX;
      mouseY = e.touches?.[0].clientY;
    } else {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }
  };

  const tapHandler = (e: MouseEvent | TouchEvent) => {
    updateMousePosition(e);
    autoAddParticle = true;
  };

  const disableAutoAddParticle = () => {
    autoAddParticle = false;
  };

  element.addEventListener(move, updateMousePosition, { passive: true });
  element.addEventListener(tap, tapHandler, { passive: true });
  element.addEventListener(tapEnd, disableAutoAddParticle, { passive: true });
  element.addEventListener("mouseleave", disableAutoAddParticle, {
    passive: true,
  });

  return () => {
    element.removeEventListener(move, updateMousePosition);
    element.removeEventListener(tap, tapHandler);
    element.removeEventListener(tapEnd, disableAutoAddParticle);
    element.removeEventListener("mouseleave", disableAutoAddParticle);

    const interval = setInterval(() => {
      if (animationFrame && particles.length === 0) {
        cancelAnimationFrame(animationFrame);
        clearInterval(interval);

        if (--instanceCounter === 0) {
          container.remove();
        }
      }
    }, 500);
  };
};

interface CoolModeProps {
  children: ReactNode;
  options?: CoolParticleOptions;
}

export const CoolMode: React.FC<CoolModeProps> = ({ children, options }) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      return applyParticleEffect(ref.current, options);
    }
  }, [options]);

  return React.cloneElement(children as React.ReactElement<any>, { ref });
};