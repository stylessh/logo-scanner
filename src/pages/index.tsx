import { useEffect, useRef } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  facingMode:
    process.env.NODE_ENV === "development" ? "user" : { exact: "environment" },
};

const Index = () => {
  const webcamRef = useRef<any>(null);

  useEffect(() => {
    if (webcamRef.current) {
      const interval = setInterval(() => {
        capture();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, []);

  const capture = async () => {
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

    console.log(data);
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
    </>
  );
};

export default Index;
