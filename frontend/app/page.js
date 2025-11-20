"use client";
import Navbar from "../components/Navbar";
import { getAuthUrl } from "../lib/api";

export default function Home() {
  const connectGmail = async () => {
    const url = await getAuthUrl();
    window.location.href = url;
  };

  return (
    <>
      <Navbar />
      <main className="p-10 text-center">
        <h1 className="text-4xl font-bold">Manage Your Subscriptions</h1>
        <p className="mt-4 text-gray-600">Connect Gmail or add manually</p>
        <div className="mt-10 flex justify-center gap-4">
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg" onClick={connectGmail}>
            Connect Gmail
          </button>
          <a href="/add" className="px-6 py-3 bg-blue-600 text-white rounded-lg">Add Manually</a>
        </div>
      </main>
    </>
  );
}
