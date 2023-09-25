import React, { useState } from "react";

const Arrow = ({ bgColor = "#eee", textColor = "#333", text = "" }) => {
  const [hovered, setHovered] = useState(false);

  const transparentBgColor = (color) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
    return `rgba(${r}, ${g}, ${b}, 0.40)`;
  };

  return (
    <svg
      width="300"
      height="30"
      viewBox="0 0 300 30"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer" }}
    >
      {/* Arrow Body (Transparent Section) */}
      <polygon
        points="290,2.5 45,2.5 45,27.5 290,27.5"
        fill={transparentBgColor(bgColor)}
      />
      {/* Arrow Tip (Opaque Section) */}
      <polygon
        points="45,2.5 15,15 45,27.5"
        fill={bgColor}
        transform={hovered ? "translate(-15, 0)" : ""}
        style={{ transition: "transform 0.5s" }}
      />
      <text
        x="60%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        fill={textColor}
        font-family="Arial"
        font-weight="bold"
        font-size="14px"
      >
        {text}
      </text>
    </svg>
  );
};

export default Arrow;
