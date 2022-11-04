import type { NextApiRequest, NextApiResponse } from "next";
import { PNG } from "pngjs";
import fs from "fs";
import imageMatch from "matches-subimage";

const baseImage = PNG.sync.read(fs.readFileSync("public/img-1.png"));

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    // get base64 string from request body
    const { image } = req.body;

    const match = imageMatch(baseImage, baseImage, { threshold: 0.5 });

    res.status(200).json({ message: "John Doe" });
  }
}
