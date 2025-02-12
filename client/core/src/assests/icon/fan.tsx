import React from "react";

type Speed<T extends number> = `${T}s`;

function FanIcon({ speed = "0.5s" }: { speed?: Speed<number> }) {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <g id="Fan">
        <path
          d="M60,28C60,12.6,47.4,0,32,0S4,12.6,4,28c0,14.1,10.4,25.8,24,27.7V58h-8c-1.5,0-3,1.5-3,3s1.5,3,3,3h24c1.6,0,3-1.3,3-3
      c0-1.7-1.4-3-3-3h-8v-2.3C49.6,53.8,60,42.1,60,28z M6,28C6,13.7,17.7,2,32,2s26,11.7,26,26S46.3,54,32,54S6,42.3,6,28z M44,60
      c0.6,0,1,0.5,1,1c0,0.5-0.4,1-1,1H20c-0.4,0-1-0.6-1-1s0.6-1,1-1h8h8H44z M34,58h-4v-2.1c0.7,0,1.3,0.1,2,0.1s1.3,0,2-0.1V58z"
        />
        <circle cx="32" cy="28" r="25" fill="white" />
        <circle cx="32" cy="28" r="3" />
        <g id="blades" fill="#8D4528">
          <path
            d="M39.2,35.1c-0.7-1.6-2.1-3.2-3.1-4.3c0.4-0.6,0.7-1.4,0.8-2.2c0.9,0,2,0.3,4.5,2.3c0.1,0.1,0.3,0.2,0.5,0.4
        c1.3,1,3.3,2.7,5.7,2.7c0.9,0,1.9-0.3,2.9-0.9c1.7-1.2,2.7-3.3,2.7-6.2c0-3.8-2-9-5.7-11.4c-5.6-3.6-10.9-1.3-13.5,2.7
        c-0.9,1.3-1.7,3.3-2.2,4.9c-0.7,0-1.3,0.2-1.9,0.4c-0.5-0.8-0.9-1.9-0.6-5.1c0-0.2,0-0.4,0.1-0.6c0.2-2.3,0.7-6.5-3.2-8.2
        c-1.9-0.8-4.3-0.4-6.6,1.1c-3.2,2.1-6.4,6.6-6.4,11c0,6.7,4.9,9.8,9.6,9.9c0.1,0,0.1,0,0.2,0c1.7,0,3.6-0.5,4.9-0.8
        c0.3,0.5,0.7,0.8,1.1,1.2c-0.5,0.8-1.5,1.9-4.5,3.1c-0.2,0.1-0.4,0.1-0.6,0.2c-2.1,0.8-6.1,2.3-5.9,6.5c0.1,2.1,1.5,4,3.9,5.4
        c2,1.2,4.9,2,7.7,2c1.7,0,3.5-0.3,5-1.1C40.6,45.1,41.2,39.4,39.2,35.1z M35.6,19.2c2-2.9,6-5.2,10.8-2.1c2.7,1.7,4.7,5.9,4.8,9.7
        c0,1.2-0.2,3.5-1.8,4.5c-2.1,1.4-4.1,0-6.2-1.7c-0.2-0.1-0.4-0.3-0.5-0.4c-3-2.3-4.5-2.6-5.9-2.7c-0.4-1.5-1.5-2.7-3-3.2
        C34.2,22,34.9,20.3,35.6,19.2z M22.8,29.6c-3.5-0.1-7.6-2.2-7.7-7.9c0-3.2,2.4-7.2,5.5-9.3c1-0.7,3-1.7,4.7-1c2.3,1,2.3,3.5,2,6.1
        c0,0.2,0,0.5-0.1,0.7c-0.3,4,0.4,5.4,1,6.4C27.5,25.5,27,26.7,27,28c0,0.3,0,0.6,0.1,0.9C25.9,29.2,24.2,29.6,22.8,29.6z M22.9,45.4
        c-1.1-0.6-2.9-1.9-2.9-3.8c-0.1-2.5,2.1-3.6,4.6-4.5c0.2-0.1,0.4-0.2,0.6-0.2c3.8-1.5,4.9-3,5.5-4c0.4,0.1,0.8,0.2,1.3,0.2
        c1,0,1.9-0.3,2.7-0.8c0.8,0.9,2.1,2.4,2.7,3.7c1.5,3.2,1.4,7.8-3.7,10.4C30.8,47.7,26.2,47.3,22.9,45.4z"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 32 28"
            to="360 32 28"
            dur={speed}
            repeatCount="indefinite"
          />
        </g>
      </g>
    </svg>
  );
}

export default FanIcon;
