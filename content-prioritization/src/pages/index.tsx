import { useEffect, useState } from "react";
import Head from "next/head";

export default function Home() {
  const [isSecondaryLoaded, setIsSecondaryLoaded] = useState(false);
  const [log, setLog] = useState<string[]>([]);

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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsSecondaryLoaded(true);
          const logMessage = `Secondary content loaded at ${new Date().toISOString()}`;
          setLog((prevLog) => [...prevLog, logMessage]);
          sendLogToServer(logMessage);
        }
      });
    });

    const secondaryContent = document.getElementById("secondary-content");
    if (secondaryContent) {
      observer.observe(secondaryContent);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <Head>
        <title>Content Prioritization Prototype</title>
      </Head>
      <main>
        <h1>Content Prioritization</h1>
        
        {/* Primary Content (Loads First) */}
        <p>Essential information is loaded immediately.</p>
        <img src="/critical.jpg" alt="Critical Content" width="400" height="300" />
        
        {/* Secondary Content (Deferred) */}
        <div id="secondary-content">
          {isSecondaryLoaded ? (
            <div>
              <h2>Secondary Content</h2>
              <img src="/non-critical.jpg" alt="Non-Critical Content" width="400" height="300" loading="lazy" />
              <video width="400" controls>
                <source src="/720_video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <p>Loading secondary content...</p>
          )}
        </div>
        
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
