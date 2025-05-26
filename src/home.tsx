import { useEffect, useState } from "react";

function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch('/api/message')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error("Error fetching message:", err);
        setMessage("Failed to connect to backend.");
      });
  }, []);

  return (
    <div>
      <h1>Beranda</h1>
      <p>{message}</p>
    </div>
  );
}

export default Home;
