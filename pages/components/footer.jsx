import { useState, useEffect } from "react";

export default function Footer() {
  const [date, setDate] = useState(new Date().getFullYear());

  useEffect(() => {
    setInterval(() => setDate(new Date().getFullYear()), 1000);
  }, []);

  return (
    <div className="flex justify-center items-center h-12 bg-transparent">
      <footer className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-400">
        zen man {date}
      </footer>
    </div>
  );
}
