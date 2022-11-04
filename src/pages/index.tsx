import { useState, useRef } from "react";
import deepai from "deepai";

import Webcam from "react-webcam";

deepai.setApiKey("4ee9f392-af6a-48b7-8073-8b40946df188");

interface IScan {
  id: string;
  output: {
    distance: number;
  };
}

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

    const res = await (await fetch("/img-1.png")).arrayBuffer();
    const baseImage = Buffer.from(res).toString("base64");

    // base image
    const resp = (await deepai.callStandardApi("image-similarity", {
      image1: baseImage,
      image2: imageSrc,
    })) as IScan;

    console.log(resp);

    // const payload = {
    //   image: imageSrc,
    // };

    // const res = await fetch("/api/scan", {
    //   method: "POST",
    //   body: JSON.stringify(payload),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });

    // const data = await res.json();

    setDistance(resp.output.distance);

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
