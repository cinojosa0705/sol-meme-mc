import { useState, useEffect, useCallback, memo, useRef } from "react";
import {
  Search,
  Rocket,
  Star,
  Sparkles,
  ArrowRight,
  PencilLine,
} from "lucide-react";

const NotebookCard = ({ children, className = "" }) => (
  <div className="relative group">
    <div
      className={`relative border-2 border-blue-200/50 p-3 sm:p-4 md:p-6 rounded-lg 
      bg-white/95 backdrop-blur shadow-md 
      bg-[linear-gradient(transparent_24px,#E7EDF1_24px)] 
      bg-[size:100%_25px] ${className}`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-red-200/50 ml-4 md:ml-8" />
      {children}
    </div>
  </div>
);

const SearchInput = memo(
  ({
    value,
    onChange,
    onSearch,
    placeholder,
    icon: Icon,
    isActive,
    isLoading,
    id,
    onFocus,
    onBlur,
  }) => {
    const inputRef = useRef(null);

    return (
      <div className="relative">
        <div className="relative w-full">
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && value.trim()) {
                onSearch(value);
              }
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            aria-label={placeholder}
            disabled={isLoading}
            className={`w-full bg-white/50 border-2 ${
              isActive ? "border-blue-400" : "border-blue-300"
            } p-3 sm:p-4 pl-9 sm:pl-12 text-sm sm:text-base text-slate-700 rounded-lg transition-all 
              focus:outline-none focus:ring-2 focus:ring-blue-400/20 
              placeholder-slate-400 font-mono 
              disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          <div className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Icon
              className={`${
                isActive ? "text-blue-600" : "text-blue-400"
              } w-4 h-4 sm:w-5 sm:h-5`}
            />
          </div>
        </div>
      </div>
    );
  }
);

const TokenDropdown = memo(
    ({ results, onSelect, isLoading, error, isVisible, containerRef }) => {
      if (!isVisible) return null;
  
      const baseDropdownClasses = `
        absolute top-full left-0 right-0 z-[9999] bg-white/95 
        border border-blue-200 rounded-b-lg backdrop-blur-md
        shadow-lg mt-[-1px] w-full
      `;
  
      if (error) {
        return (
          <div className={`${baseDropdownClasses} border-red-200 p-3 sm:p-4 text-center text-red-600 text-sm sm:text-base`}>
            {error}
          </div>
        );
      }
  
      if (isLoading) {
        return (
          <div className={`${baseDropdownClasses} p-3 sm:p-4 text-center text-slate-600 text-sm sm:text-base`}>
            Loading tokens...
          </div>
        );
      }
  
      if (!results?.length) {
        return (
          <div className={`${baseDropdownClasses} p-3 sm:p-4 text-center text-slate-600 text-sm sm:text-base`}>
            No tokens found. Try another search.
          </div>
        );
      }
  
      return (
        <div
          ref={containerRef}
          className={`${baseDropdownClasses} max-h-48 sm:max-h-64 overflow-y-auto`}
        >
          {results.map((token) => (
            <button
              key={token.id}
              onClick={() => onSelect(token)}
              className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 cursor-pointer 
                hover:bg-blue-50 active:bg-blue-100 transition-colors duration-200
                border-b border-blue-100/50 last:border-b-0"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden">
                <span className="text-blue-600 text-sm sm:text-base">
                  {token.baseAsset.symbol[0]}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-slate-700 text-sm sm:text-base">
                  {token.baseAsset.symbol}
                </span>
                <span className="text-xs sm:text-sm text-slate-500">
                  FDV: ${token.baseAsset.fdv?.toLocaleString() || "N/A"}
                </span>
              </div>
            </button>
          ))}
        </div>
      );
    }
  );

export default function Degen() {
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [resultsA, setResultsA] = useState([]);
  const [resultsB, setResultsB] = useState([]);
  const [selectedA, setSelectedA] = useState(null);
  const [selectedB, setSelectedB] = useState(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [error, setError] = useState(null);
  const [activeInput, setActiveInput] = useState(null);
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);
  const [currentPepe, setCurrentPepe] = useState("( ͡° ͜ʖ ͡°)");
  const [currentCopium, setCurrentCopium] = useState("WAGMI fren... WAGMI");

  const dropdownRefA = useRef(null);
  const dropdownRefB = useRef(null);

  const pepes = [
    "(づ｡◕‿‿◕｡)づ",
    "ʕ•ᴥ•ʔ",
    "(╯°□°）╯︵ ┻━┻",
    "( ^ ͜^ )",
    "(☞ﾟヮﾟ)☞",
  ];
  const copiumPhrases = [
    "ser... what if it actually happens?",
    "trust me bro, it's possible",
    "imagine the lambos anon",
    "we're all gonna make it",
    "fees = paid, hopium = injected",
    "your McDonald's resignation letter is ready",
    "already practicing your 'I quit' speech?",
  ];

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const searchTokens = useCallback(async (query) => {
    if (!query) return [];
    try {
      const response = await fetch(
        `https://api.ape.pro/api/v1/pools?limit=10&offset=0&searchText=${encodeURIComponent(
          query
        )}`
      );
      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      return data.pools || [];
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to fetch tokens. Please try again.");
      return [];
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefA.current &&
        !dropdownRefA.current.contains(event.target)
      ) {
        setShowDropdownA(false);
      }
      if (
        dropdownRefB.current &&
        !dropdownRefB.current.contains(event.target)
      ) {
        setShowDropdownB(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const debouncedSearchA = useCallback(
    debounce(async (query) => {
      setLoadingA(true);
      setError(null);
      const results = await searchTokens(query);
      setResultsA(results);
      setLoadingA(false);
    }, 300),
    [searchTokens]
  );

  const debouncedSearchB = useCallback(
    debounce(async (query) => {
      setLoadingB(true);
      setError(null);
      const results = await searchTokens(query);
      setResultsB(results);
      setLoadingB(false);
    }, 300),
    [searchTokens]
  );

  const handleSearchA = useCallback(
    (e) => {
      const value = e.target.value; // Get value directly from event
      setSearchA(value);
      setError(null);
      if (value.length >= 2) {
        debouncedSearchA(value);
      } else {
        setResultsA([]);
      }
    },
    [debouncedSearchA]
  );

  const handleSearchB = useCallback(
    (e) => {
      const value = e.target.value; // Get value directly from event
      setSearchB(value);
      setError(null);
      if (value.length >= 2) {
        debouncedSearchB(value);
      } else {
        setResultsB([]);
      }
    },
    [debouncedSearchB]
  );

  const handleSelectA = useCallback((token) => {
    setSelectedA(token);
    setResultsA([]);
    setSearchA(token.baseAsset.symbol)
    setShowDropdownA(false);
    setActiveInput(null);
  }, []);

  const handleSelectB = useCallback((token) => {
    setSelectedB(token);
    setResultsB([]);
    setSearchB(token.baseAsset.symbol)
    setShowDropdownB(false);
    setActiveInput(null);
  }, []);

  const handleBlurA = (e) => {
    if (!dropdownRefA.current?.contains(e.relatedTarget)) {
      setShowDropdownA(false);
      setActiveInput(null);
    }
  };

  const handleBlurB = (e) => {
    if (!dropdownRefB.current?.contains(e.relatedTarget)) {
      setShowDropdownB(false);
      setActiveInput(null);
    }
  };

  useEffect(() => {
    const updatePepeAndCopium = () => {
      setCurrentPepe((prev) => {
        const newPepe = pepes[Math.floor(Math.random() * pepes.length)];
        return newPepe !== prev
          ? newPepe
          : pepes[(pepes.indexOf(prev) + 1) % pepes.length];
      });
      setCurrentCopium((prev) => {
        const newCopium =
          copiumPhrases[Math.floor(Math.random() * copiumPhrases.length)];
        return newCopium !== prev
          ? newCopium
          : copiumPhrases[
              (copiumPhrases.indexOf(prev) + 1) % copiumPhrases.length
            ];
      });
    };

    const interval = setInterval(updatePepeAndCopium, 500);
    return () => clearInterval(interval);
  }, []);

  const calculateX = useCallback(() => {
    if (!selectedA?.baseAsset?.fdv || !selectedB?.baseAsset?.fdv) return 0;
    return selectedB.baseAsset.fdv / selectedA.baseAsset.fdv;
  }, [selectedA, selectedB]);

  const calculateLifeChanging = useCallback((x) => {
    if (x < 10) return "Nice flip ser";
    if (x < 50) return "McDonalds EXIT LOADING...";
    if (x < 100) return "Down payment on Honda Civic";
    if (x < 1000) return "LAMBO TIME SOON™";
    return "GENERATIONAL WEALTH INCOMING";
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-3 sm:px-4 py-6 sm:py-8">
      <div className="w-full max-w-4xl relative">
        <div className="text-center mb-6 sm:mb-8 space-y-2 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold text-blue-600">
            What If...
          </h1>
          <div className="text-base sm:text-lg md:text-2xl text-slate-600">
            your comfy bag pulled a {currentPepe}
          </div>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 italic">
            &gt; inject maximum copium directly into your veins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="relative">
            <NotebookCard>
              <div className="text-center mb-3 sm:mb-4 text-blue-600 text-base sm:text-lg">
                Your Comfy Bag
              </div>
              <SearchInput
                id="tokenA"
                value={searchA}
                onChange={handleSearchA}
                onSearch={() => {}}
                placeholder="Search your token..."
                icon={Search}
                isActive={activeInput === "tokenA"}
                isLoading={loadingA}
                onFocus={() => {
                  setActiveInput("tokenA");
                  setShowDropdownA(true);
                }}
                onBlur={handleBlurA}
              />
            </NotebookCard>
            <TokenDropdown
              results={resultsA}
              onSelect={handleSelectA}
              isLoading={loadingA}
              error={error}
              isVisible={showDropdownA}
              containerRef={dropdownRefA}
            />
          </div>

          <div className="relative">
            <NotebookCard>
              <div className="text-center mb-3 sm:mb-4 text-blue-600 text-base sm:text-lg">
                Your Target (Dream Big)
              </div>
              <SearchInput
                id="tokenB"
                value={searchB}
                onChange={handleSearchB}
                onSearch={() => {}}
                placeholder="Search target token..."
                icon={Rocket}
                isActive={activeInput === "tokenB"}
                isLoading={loadingB}
                onFocus={() => {
                  setActiveInput("tokenB");
                  setShowDropdownB(true);
                }}
                onBlur={handleBlurB}
              />
            </NotebookCard>
            <TokenDropdown
              results={resultsB}
              onSelect={handleSelectB}
              isLoading={loadingB}
              error={error}
              isVisible={showDropdownB}
              containerRef={dropdownRefB}
            />
          </div>
        </div>

        {(selectedA && selectedB) && (
          <NotebookCard className="mb-4 sm:mb-6">
            <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
              {selectedA && (
                <div className="text-center space-y-1 sm:space-y-2">
                  <div className="text-lg sm:text-xl md:text-2xl text-blue-600">
                    {selectedA.baseAsset.symbol}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500">
                    Current FDV: $
                    {selectedA.baseAsset.fdv?.toLocaleString() || "N/A"}
                  </div>
                </div>
              )}

              {selectedA && selectedB && (
                <ArrowRight className="text-blue-400 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
              )}

              {selectedB && (
                <div className="text-center space-y-1 sm:space-y-2">
                  <div className="text-lg sm:text-xl md:text-2xl text-blue-600">
                    {selectedB.baseAsset.symbol}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500">
                    Target FDV: $
                    {selectedB.baseAsset.fdv?.toLocaleString() || "N/A"}
                  </div>
                </div>
              )}
            </div>
          </NotebookCard>
        )}

        {selectedA && selectedB && (
          <NotebookCard className="bg-blue-50/50">
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="text-lg sm:text-xl md:text-3xl flex items-center justify-center gap-2 sm:gap-3">
                <Star className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span className="text-blue-600 font-bold">
                  HOPIUM INJECTION RESULTS
                </span>
                <Sparkles className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </div>

              <div className="text-4xl sm:text-5xl md:text-8xl font-bold text-blue-600 text-center">
                {calculateX().toFixed(2)}x
              </div>

              <div className="text-lg sm:text-xl md:text-2xl text-blue-600 text-center">
                {calculateLifeChanging(calculateX())}
              </div>

              <div className="text-sm sm:text-base md:text-lg text-slate-600 italic text-center">
                {currentCopium}
              </div>

              <div className="text-xs sm:text-sm text-slate-500 flex items-center justify-center gap-1.5 sm:gap-2">
                <PencilLine className="w-3 h-3 sm:w-4 sm:h-4" />
                *Not financial advice. Sir, this is a Wendy's.
              </div>
            </div>
          </NotebookCard>
        )}

        <div className="text-center mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm text-slate-500 flex items-center justify-center gap-1.5 sm:gap-2">
          <PencilLine className="w-3 h-3 sm:w-4 sm:h-4" />
          Made with 🤡 by degens, for degens | Powered by maximum hopium
        </div>
      </div>
    </div>
  );
}