import { useState, useEffect } from "react";
import Api from "../api/Api";
import { useList } from "../contexts/ListContext";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);      // backend search results
  const [filtered, setFiltered] = useState(null);    // results after filters

  const [loading, setLoading] = useState(false);
  const [subs, setSubs] = useState(null);

  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(1000);

  // dynamic categories
  const [categories, setCategories] = useState(["all"]);

  const { addItem } = useList();

  // Load dynamic categories from backend once
  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const allProducts = await Api.Products.getAll(); // GET /api/products
      const extracted = Array.from(
        new Set(
          (allProducts || [])
            .map((p) => p.category?.toLowerCase())
            .filter(Boolean)
        )
      );

      setCategories(["all", ...extracted]);
    } catch (err) {
      setCategories(["all"]);
    }
  }

  // Apply filters whenever results, category or price changes
  useEffect(() => {
    applyFilters();
  }, [results, category, maxPrice]);

  // -------------------------------------------
  // SEARCH USING BACKEND (Hybrid approach)
  // -------------------------------------------
  async function doSearch() {
    if (!query.trim()) return;

    setLoading(true);
    setSubs(null);

    try {
      const data = await Api.Products.search(query); // GET /api/products/search
      setResults(data || []);
    } catch (err) {
      setResults([]);
    }

    setLoading(false);
  }

  // -------------------------------------------
  // SUBSTITUTES (POST /api/suggestions/substitutes)
  // -------------------------------------------
  async function getSubs(productId) {
    setSubs(null);
    try {
      const parsedMock = { productId }; // your ParsedIntentResponse structure
      const data = await Api.Suggestions.getSubstitutes(parsedMock);
      setSubs(data || []);
    } catch (_) {
      setSubs([]);
    }
  }

  // -------------------------------------------
  // HYBRID FILTER LOGIC
  // -------------------------------------------
  function applyFilters() {
    if (!results) return;

    let temp = [...results];

    // Category
    if (category !== "all") {
      temp = temp.filter(
        (p) =>
          p.category &&
          p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Price
    temp = temp.filter((p) => (p.price || 0) <= maxPrice);

    setFiltered(temp);
  }

  // -------------------------------------------
  // UI
  // -------------------------------------------
  return (
    <div className="pt-6 pb-24">

      {/* SEARCH BAR */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search products…"
          className="flex-1 p-3 border rounded-md bg-gray-50 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={doSearch}
          className="px-4 bg-indigo-600 text-white rounded-md text-sm active:scale-95"
          disabled={loading}
        >
          Search
        </button>
      </div>

      {/* FILTERS */}
      {results && (
        <div className="mb-4 p-3 rounded-lg bg-gray-50 border space-y-4">

          {/* CATEGORY FILTER */}
          <div>
            <label className="text-xs text-gray-500">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md bg-white text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* PRICE SLIDER */}
          <div>
            <label className="text-xs text-gray-500">
              Max Price: ₹{maxPrice}
            </label>
            <input
              type="range"
              min="5"
              max="1000"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>

        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-center text-gray-500">Searching…</div>
      )}

      {/* RESULTS */}
      {filtered && !loading && (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center text-gray-500 text-sm">
              No products match these filters.
            </div>
          )}

          {filtered.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-lg border bg-white"
            >
              <div className="font-medium text-gray-900">{p.name}</div>
              <div className="text-xs text-gray-500">
                {p.brand || "Generic"} • {p.unit || "—"} • {p.category}
              </div>

              <div className="text-indigo-600 text-sm mt-1">
                ₹{p.price ?? "-"}
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() =>
                    addItem({ name: p.name, qty: 1, price: p.price })
                  }
                  className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md"
                >
                  Add
                </button>

                <button
                  onClick={() => getSubs(p.id)}
                  className="px-3 py-1 bg-gray-200 text-sm rounded-md"
                >
                  Substitutes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBSTITUTE RESULTS */}
      {subs && (
        <div className="mt-6">
          <div className="text-sm font-medium mb-2 text-gray-800">
            Substitute Options
          </div>

          {subs.length === 0 ? (
            <div className="text-sm text-gray-500">No substitutes found.</div>
          ) : (
            <div className="space-y-3">
              {subs.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-md border bg-gray-50"
                >
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-gray-500">
                    {s.brand || "Generic"} • {s.unit || "—"} • {s.category}
                  </div>
                  <div className="text-indigo-600 text-sm mt-1">
                    ₹{s.price ?? "-"}
                  </div>

                  <button
                    onClick={() =>
                      addItem({ name: s.name, qty: 1, price: s.price })
                    }
                    className="mt-2 px-3 py-1 bg-indigo-600 text-white text-sm rounded-md"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
