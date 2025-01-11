import React, { useEffect } from "react";
import { gsap } from "gsap";

export const Loader = () => {
  useEffect(() => {
    const loaderWidth = document.querySelector(".loader-container").offsetWidth;
    const numCircles = 5;

    gsap.utils.toArray(".circle").forEach((circle, index) => {
      gsap.to(circle, {
        x: loaderWidth, // Move to the end of the container
        duration: 1.3,
        delay: index * 0.1, // Stagger start times
        repeat: -1, // Repeat infinitely
        ease: "power1.inOut",
        onRepeat: () => {
          gsap.set(circle, { x: 0 }); // Reset position after reaching the end
        },
      });
    });
  }, []);

  return (
    <>
      <div className="field-container">
        <h1 className="form-title">Trying to sign you in</h1>
        <div className="loader-container">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
        <div className="button-container cancel-btn-con">
          <button type="button" className="cancel">
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};
