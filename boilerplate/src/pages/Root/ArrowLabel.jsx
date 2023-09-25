import { useSelector, useDispatch } from "react-redux";
import {
  setHoveredItem,
  clearHoveredItem,
} from "../../redux/profileDataCardSlice";

const Arrow = ({ bgColor = "#eee", textColor = "#333", text = "" }) => {
  const hoveredItem = useSelector((state) => state.profileDataCard.hoveredItem);
  const dispatch = useDispatch();

  const isHovered = hoveredItem === text;

  const transparentBgColor = (color) => {
    if (isHovered) return color; // No transparency when hovered

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
    return `rgba(${r}, ${g}, ${b}, 0.40)`; // Updated the alpha value for desired transparency
  };

  return (
    <svg
      width="250"
      height="30"
      viewBox="0 0 250 30"
      onMouseEnter={() => dispatch(setHoveredItem(text))}
      onMouseLeave={() => dispatch(clearHoveredItem())}
      style={{ cursor: "pointer" }}
    >
      {/* Arrow Body (Transparent Section) */}
      <polygon
        points="240,2.5 45,2.5 45,27.5 240,27.5"
        fill={transparentBgColor(bgColor)}
        transform={isHovered ? "translate(10, 0)" : ""}
        style={{ transition: "transform 0.5s" }}
      />
      {/* Arrow Tip (Opaque Section) */}
      <polygon
        points="45,2.5 15,15 45,27.5"
        fill={bgColor}
        transform={isHovered ? "translate(-15, 0)" : ""}
        style={{ transition: "transform 0.5s" }}
      />
      <text
        x="60%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        fill={isHovered ? "#fff" : textColor}
        font-family="Arial"
        font-weight="bold"
        font-size="14px"
        transform={isHovered ? "scale(1.05, 1)" : ""}
        style={{ transition: "transform 0.5s" }}
      >
        {text}
      </text>
    </svg>
  );
};

export default Arrow;
