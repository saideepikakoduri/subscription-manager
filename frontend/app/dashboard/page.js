"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import SubscriptionCard from "../../components/SubscriptionCard";
import { getSubscriptions, runScan } from "../../lib/api";

export default function Dashboard() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSubs = async () => {
    const data = await getSubscriptions();
    setSubs(data);
  };

  useEffect(() => { loadSubs(); }, []);

  const scanGmail = async () => {
    setLoading(true);
    const tokens = JSON.parse(localStorage.getItem("gmail_tokens"));
    await runScan(tokens);
    await loadSubs();
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Your Subscriptions</h1>
        <button onClick={scanGmail} className="mb-6 px-4 py-2 bg-green-600 text-white rounded">
          {loading ? "Scanning..." : "Scan Gmail Again"}
        </button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subs.map((s, i) => <SubscriptionCard key={i} item={s} />)}
        </div>
      </div>
    </>
  );
}
