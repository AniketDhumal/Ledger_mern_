export default function EmptyState({ title = "Nothing here yet", children }) {
  return (
    <div className="border rounded-xl p-6 text-center text-gray-600">
      <div className="text-lg font-medium mb-1">{title}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
