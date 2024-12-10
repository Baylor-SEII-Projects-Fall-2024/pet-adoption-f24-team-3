import React, { useState, useEffect } from "react";

const slides = [
  "/slides/Slide1.jpg",
  "/slides/Slide2.jpg",
  "/slides/Slide3.jpg",
  "/slides/Slide4.jpg",
];

function SlideViewer() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="slider-container">
      <div
        className="slides"
        style={{
          transform: `translateY(-${currentSlide * 100}vh)`,
          transition: "transform 0.8s ease-in-out",
        }}
      >
        {slides.map((src, index) => (
          <div
            className="slide"
            key={index}
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100vh",
              width: "100vw",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default SlideViewer;
