export function DemoBanner() {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-800">
      Demo mode: add, edit and delete changes are stored in this browser only -
      the DummyJSON API does not persist them.
    </div>
  );
}
