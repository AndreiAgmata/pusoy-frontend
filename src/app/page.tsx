"use client";
import { useState } from "react";

type SimulationResult = {
  iterations: number;
  winRate: number;
  bestArrangement: string[];
  front: string[];
  middle: string[];
  back: string[];
  autoWin?: string;
};

export default function App() {
  const [input, setInput] = useState(""); // comma or space-separated
  const [iterations, setIterations] = useState(100);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const cards = input
        .split(/[\s,]+/)
        .map((c) => c.trim().toUpperCase())
        .filter((c) => c.length > 0);

      if (cards.length !== 13) {
        alert("Please enter exactly 13 cards");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:4000/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ myCards: cards, iterations }),
      });

      if (!res.ok) throw new Error("Simulation failed");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Simulation failed. Check console for details.");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    marginBottom: "0.5rem",
    border: "1px solid white",
    borderRadius: "4px",
    backgroundColor: "#222",
    color: "white",
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Chinese Poker Monte Carlo Simulator</h1>

      <input
        type="text"
        value={input}
        placeholder="Enter 13 cards, e.g. Ah Kh Qh Jh 10h 9h 8h 7h 6h 5h 4h 3h 2h"
        onChange={(e) => setInput(e.target.value)}
        style={inputStyle}
      />

      <input
        type="number"
        value={iterations}
        onChange={(e) => setIterations(Number(e.target.value))}
        placeholder="Number of dealer simulations"
        style={inputStyle}
      />

      <button
        onClick={handleSimulate}
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#444",
          color: "white",
          border: "1px solid white",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {loading ? "Simulating..." : "Run Simulation"}
      </button>

      {result && (
        <div style={{ marginTop: "1rem" }}>
          {result.autoWin && (
            <p>
              <strong>Auto-win hand:</strong> {result.autoWin}
            </p>
          )}
          <p>
            <strong>Win rate:</strong> {(result.winRate * 100).toFixed(2)}%
          </p>
          <div>
            <p>
              <strong>Front (3 cards):</strong> {result.front.join(" ")}
            </p>
            <p>
              <strong>Middle (5 cards):</strong> {result.middle.join(" ")}
            </p>
            <p>
              <strong>Back (5 cards):</strong> {result.back.join(" ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
