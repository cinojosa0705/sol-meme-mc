import { useState, useEffect, useCallback } from 'react';
import { Search, Rocket, ChevronRight, Star, Sparkles, ArrowRight, PencilLine } from 'lucide-react';

export default function Degen() {
    const [searchA, setSearchA] = useState('');
    const [searchB, setSearchB] = useState('');
    const [resultsA, setResultsA] = useState([]);
    const [resultsB, setResultsB] = useState([]);
    const [selectedA, setSelectedA] = useState(null);
    const [selectedB, setSelectedB] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPepe, setCurrentPepe] = useState('( ͡° ͜ʖ ͡°)');
    const [currentCopium, setCurrentCopium] = useState("WAGMI fren... WAGMI");
    const [activeInput, setActiveInput] = useState(null);

  const pepes = [
    '( ͡° ͜ʖ ͡°)', 
    '(づ｡◕‿‿◕｡)づ',
    'ʕ•ᴥ•ʔ',
    '(╯°□°）╯︵ ┻━┻',
    '( ^ ͜^ )',
    '(☞ﾟヮﾟ)☞'
  ];

  const copiumPhrases = [
    "WAGMI fren... WAGMI",
    "ser... what if it actually happens?",
    "trust me bro, it's possible",
    "imagine the lambos anon",
    "we're all gonna make it",
    "fees = paid, hopium = injected",
    "your McDonald's resignation letter is ready",
    "already practicing your 'I quit' speech?",
  ];

    // Your existing functions remain the same...
    const debounce = (func, wait) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    };

  const debouncedSearch = useCallback(
    debounce((query, setResults) => {
      searchTokens(query, setResults);
    }, 300),
    []
  );

  const handleSearchA = (e) => {
    const value = e.target.value;
    setSearchA(value);
    if (value.length >= 2) {
      debouncedSearch(value, setResultsA);
    } else {
      setResultsA([]);
    }
  };

  const handleSearchB = (e) => {
    const value = e.target.value;
    setSearchB(value);
    if (value.length >= 2) {
      debouncedSearch(value, setResultsB);
    } else {
      setResultsB([]);
    }
  };

  const searchTokens = async (query, setResults) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`https://api.ape.pro/api/v1/pools?limit=10&offset=0&searchText=${query}`);
      const data = await response.json();
      setResults(data.pools || []);
    } catch (err) {
      console.error('Search failed:', err);
    }
    setLoading(false);
  };

  // Your existing effects and calculations remain the same...
  useEffect(() => {
    setCurrentPepe(pepes[Math.floor(Math.random() * pepes.length)]);
    setCurrentCopium(copiumPhrases[Math.floor(Math.random() * copiumPhrases.length)]);

    const interval = setInterval(() => {
      setCurrentPepe(pepes[Math.floor(Math.random() * pepes.length)]);
      setCurrentCopium(copiumPhrases[Math.floor(Math.random() * copiumPhrases.length)]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const calculateX = () => {
    if (!selectedA || !selectedB) return null;
    const xRequired = selectedB.baseAsset.fdv / selectedA.baseAsset.fdv;
    return xRequired;
  };

  const calculateLifeChanging = (x) => {
    if (x < 10) return "Nice flip ser";
    if (x < 50) return "McDonalds EXIT LOADING...";
    if (x < 100) return "Down payment on Honda Civic";
    if (x < 1000) return "LAMBO TIME SOON™";
    return "GENERATIONAL WEALTH INCOMING";
  };

  // Updated NotebookCard component with improved responsive design
  const NotebookCard = ({ children, className = "" }) => (
    <div className="relative group">
      <div className={`relative border-2 border-blue-200/50 p-4 md:p-6 rounded-lg 
        bg-white/95 backdrop-blur shadow-md
        bg-[linear-gradient(transparent_24px,#E7EDF1_24px)] 
        bg-[size:100%_25px]
        ${className}`}>
        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-red-200/50 ml-4 md:ml-8" />
        {children}
      </div>
    </div>
  );

  const SearchInput = ({ value, onChange, onKeyPress, placeholder, icon: Icon, isActive }) => (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onFocus={() => setActiveInput(placeholder)}
        onBlur={() => setActiveInput(null)}
        placeholder={placeholder}
        className={`w-full bg-white/50 border-2 ${
          isActive ? 'border-blue-400' : 'border-blue-300'
        } p-3 md:p-4 text-slate-700 rounded-lg transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-blue-400/20 
        placeholder-slate-400 font-mono`}
      />
      <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <Icon className={`${isActive ? 'text-blue-600' : 'text-blue-400'} animate-pulse w-5 h-5`} />
        {value.length >= 2 && (
          <span className="text-xs text-slate-500">Press Enter</span>
        )}
      </div>
    </div>
  );

  const TokenDropdown = ({ results, onSelect }) => (
    <div className="absolute top-full left-0 right-0 z-50 bg-white/95 
      border border-blue-200 border-t-0 rounded-b-lg backdrop-blur-md 
      max-h-64 overflow-y-auto shadow-lg">
      {results.map((token) => (
        <div
          key={token.id}
          onClick={() => onSelect(token)}
          className="flex items-center gap-3 p-3 cursor-pointer 
            hover:bg-blue-50 transition-colors duration-200
            border-b border-blue-100/50 last:border-b-0"
        >
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden">
            {token.baseAsset.icon ? (
              <img 
                src={token.baseAsset.icon} 
                alt={token.baseAsset.symbol}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-blue-600">{token.baseAsset.symbol[0]}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-700">{token.baseAsset.symbol}</span>
            <span className="text-sm text-slate-500">
              FDV: ${token.baseAsset.fdv.toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-slate-700 p-4 md:p-6 font-mono relative">
      {/* Notebook holes */}
      <div className="fixed left-0 top-0 bottom-0 w-8 bg-[#F5F5F5] hidden md:flex flex-col items-center py-8 gap-8">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="w-4 h-4 rounded-full bg-slate-200 border border-slate-300" />
        ))}
      </div>
      
      <div className="max-w-6xl mx-auto md:pl-8">
        {/* Header remains the same... */}
        
        {/* Search Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Token A */}
          <NotebookCard>
            <div className="text-center mb-4 text-blue-600 text-lg">Your Comfy Bag</div>
            <div className="relative">
              <SearchInput
                value={searchA}
                onChange={handleSearchA}
                placeholder="Search your token..."
                icon={Search}
                isActive={activeInput === "Search your token..."}
              />
              {resultsA.length > 0 && (
                <TokenDropdown 
                  results={resultsA} 
                  onSelect={(token) => {
                    setSelectedA(token);
                    setResultsA([]);
                    setSearchA('');
                  }}
                />
              )}
            </div>
          </NotebookCard>

          {/* Token B */}
          <NotebookCard>
            <div className="text-center mb-4 text-blue-600 text-lg">Your Target (Dream Big)</div>
            <div className="relative">
              <SearchInput
                value={searchB}
                onChange={handleSearchB}
                placeholder="Search target token..."
                icon={Rocket}
                isActive={activeInput === "Search target token..."}
              />
              {resultsB.length > 0 && (
                <TokenDropdown 
                  results={resultsB} 
                  onSelect={(token) => {
                    setSelectedB(token);
                    setResultsB([]);
                    setSearchB('');
                  }}
                />
              )}
            </div>
          </NotebookCard>
        </div>

        {/* Selected Tokens */}
        {(selectedA || selectedB) && (
          <NotebookCard className="mb-8">
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {selectedA && (
                <div className="text-center space-y-2">
                  <div className="text-xl md:text-2xl text-blue-600">{selectedA.baseAsset.symbol}</div>
                  <div className="text-sm text-slate-500">Current FDV: ${selectedA.baseAsset.fdv.toLocaleString()}</div>
                </div>
              )}
              
              {selectedA && selectedB && (
                <ArrowRight className="text-blue-400 w-8 h-8 animate-pulse" />
              )}
              
              {selectedB && (
                <div className="text-center space-y-2">
                  <div className="text-xl md:text-2xl text-blue-600">{selectedB.baseAsset.symbol}</div>
                  <div className="text-sm text-slate-500">Target FDV: ${selectedB.baseAsset.fdv.toLocaleString()}</div>
                </div>
              )}
            </div>
          </NotebookCard>
        )}

        {/* Results */}
        {selectedA && selectedB && (
          <NotebookCard className="bg-blue-50/50">
            <div className="space-y-6">
              <div className="text-2xl md:text-3xl flex items-center justify-center gap-3">
                <Star className="text-blue-500 animate-spin" />
                <span className="text-blue-600 font-bold">
                  HOPIUM INJECTION RESULTS
                </span>
                <Sparkles className="text-blue-500 animate-bounce" />
              </div>
              
              <div className="text-6xl md:text-8xl font-bold text-blue-600 text-center animate-pulse">
                {calculateX().toFixed(2)}x
              </div>
              
              <div className="text-xl md:text-2xl text-blue-600 text-center animate-bounce">
                {calculateLifeChanging(calculateX())}
              </div>
              
              <div className="text-lg text-slate-600 italic text-center">
                {currentCopium}
              </div>
              
              <div className="text-sm text-slate-500 flex items-center justify-center gap-2">
                <PencilLine className="w-4 h-4" />
                *Not financial advice. Sir, this is a Wendy's.
              </div>
            </div>
          </NotebookCard>
        )}

        <div className="text-center mt-8 text-sm text-slate-500 flex items-center justify-center gap-2">
          <PencilLine className="w-4 h-4" />
          Made with 🤡 by degens, for degens | Powered by maximum hopium
        </div>
      </div>
    </div>
  );
}