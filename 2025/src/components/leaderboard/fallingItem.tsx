import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CONSTANT } from "~/constants";

const getSize: () => { width: number; height: number } = () => {
  const size = Math.floor(Math.random() * 40) + 40;
  return { width: size, height: size };
};

const getPosition: () => number = () => {
  return Math.floor(Math.random() * 80) + 10;
};

const FallingItem = ({ delay }: {
  delay: number;
}) => {
  const [left, setLeft] = useState(getPosition());
  const [size, setSize] = useState(getSize());

  useEffect(() => {
    setTimeout(() => {
      setInterval(() => {
        setLeft(getPosition());
        setSize(getSize());
        // TODO: 100000 should be same as that in animation duration of free-fall in tailwind.config.js
      }, 10000);
    }, delay);
  }, [delay]);

  return (
    <div
      className={"pointer-events-none absolute animate-free-fall hue-rotate-0"}
      style={{
        animationDelay: `${delay}ms`,
        top: "0px",
        left: `${left}%`,
        width: `${size.width}`,
        height: `${size.height}`,
      }}
    >
      <Image
        src={CONSTANT.ASSETS.LEADERBOARD.TIMESTONE}
        alt={CONSTANT.ASSETS.LEADERBOARD.TIMESTONE}
        width={size.width}
        height={size.height}
        style={{
          filter: `hue-rotate(${[0, 60, 90, 180][Math.floor(Math.random() * 7)]}deg)`,
        }}
      />
    </div>
  );
};

export default FallingItem;
