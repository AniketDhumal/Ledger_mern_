export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <span className="inline-block h-4 w-4 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
