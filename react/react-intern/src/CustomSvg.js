import React from "react";

function CustomSvg({ size }) {
  const svgStyle = {
    fill: "rgb(213, 74, 23)",
    fillRule: "nonzero",
    opacity: 1,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      width={size}
      height={size}
      viewBox="0 0 1000 1000"
      xmlSpace="preserve"
    >
      <defs></defs>
      <g transform="matrix(1.1156 0 0 -0.9858 483.9758 494.32)" id="754724">
        <g style={svgStyle} vectorEffect="non-scaling-stroke">
          <g transform="matrix(33.3333 0 0 33.3333 -71.2668 -100.0001)">
            <path
              style={svgStyle}
              transform=" translate(-9.862, -9)"
              d="M 13.862 6 h -8 c -0.553 0 -1 -0.448 -1 -1 s 0.447 -1 1 -1 h 8 c 0.553 0 1 0.448 1 1 s -0.447 1 -1 1 z M 11.862 10 h -6 c -0.553 0 -1 -0.448 -1 -1 s 0.447 -1 1 -1 h 6 c 0.553 0 1 0.448 1 1 s -0.447 1 -1 1 z M 10.862 13 c 0 0.55 -0.45 1 -1 1 h -4 c -0.55 0 -1 -0.45 -1 -1 s 0.45 -1 1 -1 h 4 c 0.55 0 1 0.45 1 1 z"
              stroke-linecap="round"
            />
          </g>
          <g transform="matrix(33.3333 0 0 33.3333 -71.2669 -0.0005)">
            <path
              style={svgStyle}
              transform=" translate(-9.862, -12)"
              d="M 18.862 2 v 9 c 0 0.55 -0.45 1 -1 1 s -1 -0.45 -1 -1 V 2.5 c 0 -0.28 -0.22 -0.5 -0.5 -0.5 h -13 c -0.28 0 -0.5 0.22 -0.5 0.5 v 19 c 0 0.28 0.22 0.5 0.5 0.5 h 10.5 c 0.55 0 1 0.45 1 1 s -0.45 1 -1 1 h -11 c -1.1 0 -2 -0.9 -2 -2 V 2 c 0 -1.1 0.9 -2 2 -2 h 14 c 1.1 0 2 0.9 2 2 z"
              stroke-linecap="round"
            />
          </g>
          <g transform="matrix(33.3333 0 0 33.3333 195.3999 199.9999)">
            <path
              style={svgStyle}
              transform=" translate(-17.862, -18)"
              d="M 21.862 18 c 0 0.55 -0.45 1 -1 1 h -2 v 2 c 0 0.55 -0.45 1 -1 1 s -1 -0.45 -1 -1 v -2 h -2 c -0.55 0 -1 -0.45 -1 -1 s 0.45 -1 1 -1 h 2 v -2 c 0 -0.55 0.45 -1 1 -1 s 1 0.45 1 1 v 2 h 2 c 0.55 0 1 0.45 1 1 z"
              stroke-linecap="round"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default CustomSvg;
