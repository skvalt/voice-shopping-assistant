import QuantityControl from "./QuantityControl";
import { useList } from "../../contexts/ListContext";

/**
 * Displays a single item:
 *  - name
 *  - brand (if available)
 *  - price
 *  - quantity controls
 */

export default function ItemCard({ item }) {
  const { removeItem } = useList();

  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <div className="font-medium text-gray-900 text-sm">
          {item.name}
        </div>
        <div className="text-xs text-gray-500">
          {item.brand || "Generic"} • ₹{item.price ?? "-"}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <QuantityControl name={item.name} qty={item.qty || 1} />

        <button
          onClick={() => removeItem(item.name)}
          className="text-red-500 text-xs px-2 py-1 rounded hover:bg-red-50"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
