import { useState, useRef } from "react";
import deepai from "deepai";
import Result from "components/Result";

import DomToImage from "dom-to-image";

import Webcam from "react-webcam";

deepai.setApiKey(process.env.NEXT_PUBLIC_DEEPAI_API_KEY);

const videoConstraints = {
  facingMode:
    process.env.NODE_ENV === "development" ? "user" : { exact: "environment" },
};

import logos from "logos.json";

const Index = () => {
  const webcamRef = useRef<any>(null);
  const screenshotRef = useRef<any>(null);

  const [capturing, setCapturing] = useState(false);
  const [result, setResult] = useState<IResult | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const downloadImage = (src: string) => {
    const a = document.createElement("a");
    a.href = src;
    a.download = "image.png";
    a.click();
  };

  const capture = async () => {
    setCapturing(true);
    setResult(null);
    setError(null);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const imageSrc = webcamRef.current?.getScreenshot();

    setScreenshot(imageSrc);

    const base64 = await DomToImage.toPng(screenshotRef.current, {
      width: isMobile ? 300 : 400,
      height: isMobile ? 300 : 400,
      quality: 1,
    });

    setScreenshot(null);

    // download image on dev
    if (process.env.NODE_ENV === "development") {
      downloadImage(base64);
    }

    // compare image to each logo
    const scans: IResult[] = await Promise.all(
      logos.map(async (logo) => {
        const buff = await (await fetch(logo.image)).arrayBuffer();
        const baseImage = Buffer.from(buff).toString("base64");

        const res = (await deepai.callStandardApi("image-similarity", {
          image1: base64,
          image2: baseImage,
        })) as IScan;

        return {
          id: logo.id,
          name: logo.name,
          url: logo.url,
          output: res.output,
        };
      })
    );

    // get the closest match
    const closest = scans.reduce((prev, current) =>
      prev.output.distance < current.output.distance ? prev : current
    );

    console.log(scans);

    // if the closest match is not enough of a match, return an error
    if (closest.output.distance > 26) {
      setError("No match found.");
      setResult(null);
    } else {
      setError(null);
      setResult(closest);
    }

    setCapturing(false);
  };

  return (
    <main className="wrapper">
      <Webcam
        width={400}
        height={400}
        ref={webcamRef}
        className={`webcam`}
        screenshotFormat="image/png"
        videoConstraints={videoConstraints}
        screenshotQuality={0.9}
      />

      {/* 400x400 screenshot area */}
      <div
        className={`screnshot-area ${screenshot ? "has-image" : ""}`}
        ref={screenshotRef}
      >
        {screenshot && <img src={screenshot} className="image" />}
      </div>

      {/* Scan Button */}
      <button onClick={capture} className="scan-button" disabled={capturing}>
        Scan
      </button>

      {/* Error */}
      {error && <p className="error">{error}</p>}

      {/* Result */}
      {result && <Result result={result} />}
    </main>
  );
};

export default Index;
