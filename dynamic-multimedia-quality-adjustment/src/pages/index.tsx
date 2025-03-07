import { useEffect, useState } from "react";
import Head from "next/head";

const getVideoQuality = (downlink: number): string => {
  if (downlink > 5) return "1080p";
  if (downlink > 2) return "720p";
  if (downlink > 1) return "480p";
  return "360p";
};

export default function Home() {
  const [networkSpeed, setNetworkSpeed] = useState<number | null>(null);
  const [videoQuality, setVideoQuality] = useState<string>("720p");
  const [log, setLog] = useState<string[]>([]);

  const sendLogToServer = async (speed: number, quality: string) => {
    await fetch("/api/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ speed, quality, timestamp: new Date().toISOString() }),
    });
  };

  useEffect(() => {
    if (typeof navigator !== "undefined" && "connection" in navigator) {
      const connection = (navigator as any).connection;
      setNetworkSpeed(connection.downlink);
      setVideoQuality(getVideoQuality(connection.downlink));
      setLog((prevLog) => [...prevLog, `Speed: ${connection.downlink} Mbps, Quality: ${getVideoQuality(connection.downlink)}`]);
      sendLogToServer(connection.downlink, getVideoQuality(connection.downlink));
      
      const updateNetworkInfo = () => {
        setNetworkSpeed(connection.downlink);
        setVideoQuality(getVideoQuality(connection.downlink));
        setLog((prevLog) => [...prevLog, `Speed: ${connection.downlink} Mbps, Quality: ${getVideoQuality(connection.downlink)}`]);
        sendLogToServer(connection.downlink, getVideoQuality(connection.downlink));
      };
      connection.addEventListener("change", updateNetworkInfo);
      return () => connection.removeEventListener("change", updateNetworkInfo);
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Adaptive Media Prototype</title>
      </Head>
      <main>
        <h1>Adaptive Multimedia Quality Adjustment</h1>
        <p>Current Network Speed: {networkSpeed ? `${networkSpeed} Mbps` : "Unknown"}</p>
        <p>Selected Video Quality: {videoQuality}</p>
        <video width="600" controls>
          <source src={`/sample_${videoQuality}.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h2>Performance Logs</h2>
        <ul>
          {log.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </main>
    </div>
  );
}
