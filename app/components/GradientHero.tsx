import { useEffect } from "react";
import { Gradient } from "./Gradient.js";

export default function GradientHero() {
  useEffect(() => {
    // Create your instance
    const gradient = new Gradient();

    // Call `initGradient` with the selector to your canvas
    gradient.initGradient("#gradient-canvas");
  });

  return (
    <>
      <style>
        {`
            #gradient-canvas {
            width:100%;
            height:100%;
            --gradient-color-1: #D9622B; 
            --gradient-color-2: #ff6500; 
            --gradient-color-3: #d26c2b;  
            --gradient-color-4: #EE793C;
            }
         `}
      </style>
      <canvas
        className="-z-10 fixed top-0 left-0 bottom-0 right-0"
        id="gradient-canvas"
        data-transition-in
      />
    </>
  );
}
