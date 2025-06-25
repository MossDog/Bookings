import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchSellersByName } from "@/utils/seller";
import { useDebouncedCallback } from "@/utils/debounce";

interface SellerPreview {
  user_id: string;
  name: string;
  slug: string;
  category: string;
}

export default function SellerSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SellerPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchResults = async (search: string) => {
    setLoading(true);
    const sellers = await searchSellersByName(search);
    setResults(sellers);
    setLoading(false);
  };

  const debouncedFetch = useDebouncedCallback(fetchResults, 800);

  useEffect(() => {
    if (query.length >= 2) {
      debouncedFetch(query);
    } else {
      setResults([]);
    }

    return () => debouncedFetch.cancel();
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      {/* Input Bar */}
      <div className="join w-full shadow-md">
        <input
          type="text"
          placeholder="Search businesses..."
          className="input input-bordered join-item w-full rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn join-item bg-primary text-white rounded-r-lg px-4 hover:bg-primary-focus">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
            />
          </svg>
        </button>
      </div>

      {/* Dropdown */}
      {query && (
        <ul className="absolute z-30 mt-1 w-full max-h-60 overflow-y-auto rounded-box border border-base-300 bg-base-100 shadow-lg">
          {loading ? (
            <li className="p-4 text-left text-base-content/70">Loading...</li>
          ) : results.length === 0 ? (
            <li className="p-4 text-left text-base-content/70">No results</li>
          ) : (
            results.map((seller) => (
              <li
                key={seller.user_id}
                className="p-3 text-left hover:bg-base-200 cursor-pointer"
                onClick={() => navigate(`/${seller.slug}`)}
              >
                <div className="font-medium text-sm text-base-content">
                  {seller.name}
                </div>
                <div className="text-xs text-base-content/60">
                  {seller.category}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
