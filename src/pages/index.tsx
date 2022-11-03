import Webcam from "react-webcam";

const videoConstraints = {
  facingMode: { exact: "environment" },
};

const Index = () => {
  return (
    <Webcam
      className="webcam"
      screenshotFormat="image/png"
      videoConstraints={videoConstraints}
    />
  );
};

export default Index;
