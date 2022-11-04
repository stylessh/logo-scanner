import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import deepai from "deepai";

deepai.setApiKey(process.env.DEEPAI_API_KEY);

type Data = {
  distance: number;
};

interface IScan {
  id: string;
  output: {
    distance: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    // get base64 string from request body
    const { image }: { image: string } = req.body;

    const baseImage = fs.readFileSync("public/img-1.png");

    // Buffer to base64
    const base64Image = baseImage.toString("base64");

    // base image
    const resp = (await deepai.callStandardApi("image-similarity", {
      image1: base64Image,
      image2: image,
    })) as IScan;

    console.log(resp);

    res.status(200).json({ distance: resp.output.distance });
  }
}
