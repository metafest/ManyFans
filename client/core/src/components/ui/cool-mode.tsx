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
  curveAmplitude: number;
  curveFrequency: number;
  timeOffset: number;
  angle: number; // Initial angle of trajectory
  wobbleSpeed: number; // Speed of wobble
  verticalWobble: number; // Vertical wobble amplitude
  phase: number; // Phase offset for wobble
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
  const initialSize = 40; // Initial size
  const finalSize = 200; // Final size

  let particles: CoolParticle[] = [];

  const container = getContainer();

  function generateParticle() {
    // Reduced speeds
    const speed = Math.random() * 8 + 5; // Reduced from 15 + 10
    const angle = Math.random() * 360 * (Math.PI / 180); // Convert to radians
    const speedHorz = Math.cos(angle) * speed;
    const speedUp = Math.sin(angle) * speed + (Math.random() * 8 + 5); // Reduced from 15 + 10

    const spinVal = Math.random() * 360;
    const spinSpeed = (Math.random() * 2 - 1) * 2; // Reduced spin speed
    const rect = element.getBoundingClientRect();
    const top = rect.top + rect.height / 2;
    const left = rect.left + rect.width / 2;

    const particle = createParticleElement(particleType, initialSize);
    particle.style.position = "absolute";
    particle.style.transition = "width 0.8s ease-out, height 0.8s ease-out"; // Faster initial transition
    particle.style.opacity = "0";
    particle.style.transform = "scale(0)";

    container.appendChild(particle);

    // Start animation after a small delay
    setTimeout(() => {
      particle.style.opacity = "1";
      particle.style.transform = "scale(1)";
    }, 50);

    particles.push({
      direction: Math.sign(speedHorz), // Direction based on horizontal speed
      element: particle,
      left,
      size: initialSize,
      speedHorz: Math.abs(speedHorz), // Use absolute value for speed
      speedUp,
      spinSpeed,
      spinVal,
      top,
      isPaused: false,
      pauseStartTime: 0,
      angle,
      wobbleSpeed: Math.random() * 0.05 + 0.02, // Reduced wobble speed
      verticalWobble: Math.random() * 50 + 25, // Reduced wobble amount
      phase: Math.random() * Math.PI * 2,
      curveAmplitude: Math.random() * 100 + 50,
      curveFrequency: Math.random() * 0.02 + 0.01,
      timeOffset: Date.now(),
    });
  }

  function refreshParticles() {
    particles.forEach((p) => {
      if (!p.isPaused) {
        p.speedUp -= 0.1; // Reduced gravity effect (was 0.2)

        // Faster growth rate
        if (p.size < finalSize) {
          p.size = Math.min(p.size * 1.05, finalSize); // Increased growth rate
          const svg = p.element.querySelector("svg");
          if (svg) {
            svg.style.width = `${p.size}px`;
            svg.style.height = `${p.size}px`;
          }
        }

        const time = (Date.now() - p.timeOffset) * 0.001; // Time in seconds

        // Complex motion pattern combining multiple waves
        const horizontalWave =
          Math.sin(time * p.wobbleSpeed + p.phase) * p.curveAmplitude;
        const verticalWave =
          Math.cos(time * p.wobbleSpeed * 1.5 + p.phase) * p.verticalWobble;

        // Update position using initial trajectory and wave modifications
        p.left += p.speedHorz * p.direction + horizontalWave * 0.1;
        p.top += -p.speedUp + verticalWave * 0.1;
        p.spinVal += p.spinSpeed;

        p.element.setAttribute(
          "style",
          [
            "position:absolute",
            `top:${p.top}px`,
            `left:${p.left}px`,
            `transform:rotate(${p.spinVal}deg)`,
            "transition: width 1.5s ease-out, height 1.5s ease-out",
            "opacity: 1",
          ].join(";")
        );
      }

      // Remove particles that have fallen below the viewport
      if (
        p.top >=
        Math.max(window.innerHeight, document.body.clientHeight) + p.size
      ) {
        particles = particles.filter((o) => o !== p);
        p.element.remove();
      }
    });
  }

  let animationFrame: number | undefined;

  function loop() {
    refreshParticles();
    animationFrame = requestAnimationFrame(loop);
  }

  loop();

  // Only handle click/tap events
  const tapHandler = (e: MouseEvent | TouchEvent) => {
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

  element.addEventListener("click", tapHandler);
  element.addEventListener("touchstart", tapHandler);

  return () => {
    element.removeEventListener("click", tapHandler);
    element.removeEventListener("touchstart", tapHandler);

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
