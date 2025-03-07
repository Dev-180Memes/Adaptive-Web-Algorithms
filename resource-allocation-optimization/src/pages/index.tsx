import { useEffect, useState } from "react";
import Head from "next/head";

export default function Home() {
  const [cachedData, setCachedData] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const fetchData = async () => {
    const response = await fetch("/api/data");
    const data = await response.json();
    localStorage.setItem("cachedData", JSON.stringify(data));
    setCachedData(JSON.stringify(data));
    
    const logMessage = `Data fetched & cached at ${new Date().toISOString()}`;
    setLog((prevLog) => [...prevLog, logMessage]);
    sendLogToServer(logMessage);
  };

  const sendLogToServer = async (message: string) => {
    await fetch("/api/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, timestamp: new Date().toISOString() }),
    });
  };

  useEffect(() => {
    const storedData = localStorage.getItem("cachedData");
    if (storedData) {
      setCachedData(storedData);
      setLog((prevLog) => [...prevLog, "Loaded cached data from localStorage"]);
    } else {
      fetchData();
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Resource Allocation Optimization</title>
      </Head>
      <main>
        <h1>Resource Allocation Optimization</h1>
        <p>Data: {cachedData || "Loading..."}</p>
        <button onClick={fetchData}>Refresh Data</button>
        
        {/* Performance Log */}
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