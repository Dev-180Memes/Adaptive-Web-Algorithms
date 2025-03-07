import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const logFile = path.join(process.cwd(), "logs.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { message, timestamp } = req.body;
    const logEntry = { message, timestamp };

    let logs = [];
    if (fs.existsSync(logFile)) {
      logs = JSON.parse(fs.readFileSync(logFile, "utf-8"));
    }

    logs.push(logEntry);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));

    return res.status(200).json({ message: "Log saved successfully!" });
  }
  return res.status(405).json({ message: "Method not allowed" });
}
