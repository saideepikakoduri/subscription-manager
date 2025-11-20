export default function SubscriptionCard({ item }) {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="font-semibold text-lg">{item.service}</h2>
      <p>Amount: {item.amount} {item.currency}</p>
      <p>Cycle: {item.billingCycle}</p>
      <p>Renewal: {item.renewalDate}</p>
      <span className="text-xs bg-blue-200 px-2 py-1 rounded">{item.source}</span>
    </div>
  );
}
