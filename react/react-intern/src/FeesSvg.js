import React from "react";

function FeesSvg({ size }) {
  const svgStyle = {
    fill: "rgb(237, 21, 21)",
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
      <desc>Created with Fabric.js 3.5.0</desc>
      <defs></defs>
      <g transform="matrix(7.2896 0 0 7.2896 528.4838 340.0104)" id="523394">
        <path
          style={svgStyle}
          transform=" translate(-50.01, -50.01)"
          d="M 49.76 83.49 H 23.51 a 1 1 0 0 1 -1 -1 v -65 a 1 1 0 0 1 1 -1 h 29 a 1 1 0 0 1 1 1 v 21 a 2 2 0 0 0 2 2 h 21 a 1 1 0 0 1 1 1 V 52.78 a 2 2 0 0 0 2 2 h 1 a 2 2 0 0 0 2 -2 v -15 a 2 2 0 0 0 -0.58 -1.41 L 57.63 12.1 a 2 2 0 0 0 -1.41 -0.59 H 19.51 a 2 2 0 0 0 -2 2 v 73 a 2 2 0 0 0 2 2 H 49.76 a 2 2 0 0 0 2 -2 v -1 A 2 2 0 0 0 49.76 83.49 Z m 8.74 -61 a 1 1 0 0 1 1.7 -0.7 l 12 12 a 1 1 0 0 1 -0.71 1.71 h -12 a 1 1 0 0 1 -1 -1 Z"
          stroke-linecap="round"
        />
      </g>
      <g transform="matrix(7.2896 0 0 7.2896 667.3155 497.0597)" id="944495">
        <path
          style={svgStyle}
          transform=" translate(-69.055, -71.5541)"
          d="M 66.6 56.66 V 79.1 l -6.82 -5.66 a 2 2 0 0 0 -2.69 0.12 l -0.8 0.81 a 2 2 0 0 0 0 2.87 l 11.4 10.67 a 2 2 0 0 0 2.73 0 l 11.4 -10.67 a 2 2 0 0 0 0 -2.87 l -0.81 -0.81 a 2 2 0 0 0 -2.69 -0.12 L 71.6 79.1 V 56.66 a 2 2 0 0 0 -2 -2 h -1 A 2 2 0 0 0 66.6 56.66 Z"
          stroke-linecap="round"
        />
      </g>
    </svg>
  );
}

export default FeesSvg;
