"use client";
// TODO: Fix the page overflow
// TODO: Fix the button, make it responsive
import FanIcon from "@/assests/icon/fan";
import { BrutalButton } from "@/components/ui/button/brutal-button";
import { useState } from "react";

export default function FanPage() {
  const [speed, setSpeed] = useState(3);

  const speeds = [
    { value: 1, label: "Low" }, // slower
    { value: 0.8, label: "Medium" }, // medium
    { value: 0.4, label: "High" }, // faster
    { value: 0.1, label: "Turbo" }, // fastest
  ];

  return (
    <div className="flex flex-col h-screen items-center gap-5 pt-5 px-5 text-white ">
      <div className="flex w-full items-center justify-center bg-gray-800 pt-5 ">
        <div className="w-96 h-96 flex pb-5">
          <FanIcon speed={`${speed}s`} />
        </div>
      </div>

      <div className="flex gap-5 pt-10">
        {speeds.map((s, index) => (
          <BrutalButton key={index} onClick={() => setSpeed(s.value)}>
            {s.label}
          </BrutalButton>
        ))}
      </div>
    </div>
  );
}
