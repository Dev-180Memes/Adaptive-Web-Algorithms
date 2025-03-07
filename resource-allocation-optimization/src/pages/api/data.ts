import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const mockData = { message: "Hello, this is mock data!", timestamp: new Date().toISOString() };
    return res.status(200).json(mockData);
  }
  return res.status(405).json({ message: "Method not allowed" });
}
