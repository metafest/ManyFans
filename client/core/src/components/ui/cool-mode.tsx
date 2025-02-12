"use client";

import React, { ReactNode, useEffect, useRef, isValidElement } from "react";
import ReactDOMServer from "react-dom/server";

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
  burstCount?: number;
  initialSize?: number;
  finalSize?: number;
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
    "overflow:hidden; position:fixed; height:100%; top:0; left:0; right:0; bottom:0; pointer-events:none; z-index:2147483647"
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
        `hsl(${Math.random() * 360}, 70%, 50%)`
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
    const svg = particle.querySelector("svg");
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
  options?: CoolParticleOptions
): (() => void) => {
  instanceCounter++;

  const defaultParticle = "circle";
  const particleType = options?.particle || defaultParticle;
  const limit = options?.burstCount || 15;
  const initialSize = options?.initialSize || 20;
  const finalSize = options?.finalSize || 120;

  let particles: CoolParticle[] = [];
  let mouseX = 0;
  let mouseY = 0;

  const container = getContainer();

  function generateParticle() {
    const speedHorz = options?.speedHorz || Math.random() * 10;
    const speedUp = options?.speedUp || Math.random() * 25;
    const spinVal = Math.random() * 360;
    const spinSpeed = (Math.random() * 2 - 1) * 3;
    const top = mouseY;
    const left = mouseX;
    const direction = Math.random() <= 0.5 ? -1 : 1;

    const particle = createParticleElement(particleType, initialSize);
    particle.style.position = "absolute";
    particle.style.transition = "width 1.5s ease-out, height 1.5s ease-out";

    container.appendChild(particle);

    particles.push({
      direction,
      element: particle,
      left,
      size: initialSize,
      speedHorz,
      speedUp,
      spinSpeed,
      spinVal,
      top,
      isPaused: false,
      pauseStartTime: 0,
    });
  }

  function refreshParticles() {
    particles.forEach((p) => {
      if (!p.isPaused) {
        p.speedUp = Math.min(p.speedUp - 0.5, p.speedUp);

        // Gradually increase size
        if (p.size < finalSize) {
          p.size = Math.min(p.size * 1.05, finalSize);
          const svg = p.element.querySelector("svg");
          if (svg) {
            svg.style.width = `${p.size}px`;
            svg.style.height = `${p.size}px`;
          }
        }

        p.left = p.left - p.speedHorz * p.direction;
        p.top = p.top - p.speedUp;
        p.spinVal += p.spinSpeed;
      }

      if (
        p.top >=
        Math.max(window.innerHeight, document.body.clientHeight) + p.size
      ) {
        particles = particles.filter((o) => o !== p);
        p.element.remove();
      }

      p.element.setAttribute(
        "style",
        [
          "position:absolute",
          `top:${p.top}px`,
          `left:${p.left}px`,
          `transform:rotate(${p.spinVal}deg)`,
          "transition: width 1.5s ease-out, height 1.5s ease-out",
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
      particles.length < limit &&
      currentTime - lastParticleTimestamp > particleGenerationDelay
    ) {
      generateParticle();
      lastParticleTimestamp = currentTime - 100;
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
    // Generate burst of particles
    const burstCount = options?.burstCount || 15;
    for (let i = 0; i < burstCount; i++) {
      setTimeout(() => {
        if (particles.length < limit) {
          generateParticle();
        }
      }, i * 50); // Stagger particle generation
    }
  };

  const disableAutoAddParticle = () => {};

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
