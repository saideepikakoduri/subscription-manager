export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-black text-white">
      <h1 className="font-bold text-xl">SubTrackAI</h1>
      <div className="space-x-6">
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/add">Add</a>
      </div>
    </nav>
  );
}
