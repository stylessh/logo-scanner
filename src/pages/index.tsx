import { useState, useRef } from "react";
import deepai from "deepai";
import Result from "components/Result";

import Webcam from "react-webcam";

deepai.setApiKey(process.env.NEXT_PUBLIC_DEEPAI_API_KEY);

const videoConstraints = {
  facingMode:
    process.env.NODE_ENV === "development" ? "user" : { exact: "environment" },
};

import logos from "logos.json";

const Index = () => {
  const webcamRef = useRef<any>(null);
  const [capturing, setCapturing] = useState(false);
  const [result, setResult] = useState<IResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const capture = async () => {
    setCapturing(true);
    setResult(null);
    setError(null);

    const imageSrc = webcamRef.current?.getScreenshot();

    // compare image to each logo
    const scans: IResult[] = await Promise.all(
      logos.map(async (logo) => {
        const buff = await (await fetch(logo.image)).arrayBuffer();
        const baseImage = Buffer.from(buff).toString("base64");

        const res = (await deepai.callStandardApi("image-similarity", {
          image1: imageSrc,
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

    console.log(closest);

    // if the closest match is not enough of a match, return an error
    if (closest.output.distance >= 28) {
      setError("No match found.");
      setResult(null);
    } else {
      setError(null);
      setResult(closest);
    }

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

      {/* Error */}
      {error && <p className="error">{error}</p>}

      {/* Result */}
      {result && <Result result={result} />}
    </>
  );
};

export default Index;
