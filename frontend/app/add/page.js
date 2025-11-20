"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import { addManualSubscription } from "../../lib/api";

export default function Add() {
  const [form, setForm] = useState({
    service: "", amount: "", currency: "INR",
    billingCycle: "monthly", renewalDate: ""
  });

  const submit = async () => {
    await addManualSubscription(form);
    alert("Added successfully!");
  };

  return (
    <>
      <Navbar />
      <div className="p-10 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-4">Add Subscription</h1>
        <div className="space-y-4">
          <input placeholder="Service Name" className="w-full p-2 border rounded"
            onChange={e => setForm({ ...form, service: e.target.value })} />
          <input placeholder="Amount" type="number" className="w-full p-2 border rounded"
            onChange={e => setForm({ ...form, amount: e.target.value })} />
          <input placeholder="Renewal Date" type="date" className="w-full p-2 border rounded"
            onChange={e => setForm({ ...form, renewalDate: e.target.value })} />
          <select className="w-full p-2 border rounded"
            onChange={e => setForm({ ...form, billingCycle: e.target.value })}>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button onClick={submit} className="px-6 py-3 bg-blue-600 text-white rounded-lg w-full">
            Save Subscription
          </button>
        </div>
      </div>
    </>
  );
}
