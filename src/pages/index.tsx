import { useState, useRef } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  facingMode:
    process.env.NODE_ENV === "development" ? "user" : { exact: "environment" },
};

const Index = () => {
  const webcamRef = useRef<any>(null);
  const [capturing, setCapturing] = useState(false);
  const [distance, setDistance] = useState<number>(0);

  const capture = async () => {
    setCapturing(true);

    const imageSrc = webcamRef.current?.getScreenshot();

    const payload = {
      image: imageSrc,
    };

    const res = await fetch("/api/scan", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    setDistance(data.distance);

    setCapturing(false);
  };

  return (
    <>
      <Webcam
        ref={webcamRef}
        className="webcam"
        screenshotFormat="image/png"
        videoConstraints={videoConstraints}
        screenshotQuality={0.6}
      />

      {/* Scan Button */}
      <button onClick={capture} className="scan-button" disabled={capturing}>
        Scan
      </button>

      {/* Distance */}
      {distance > 0 && <div className="distance">{distance}</div>}
    </>
  );
};

export default Index;
