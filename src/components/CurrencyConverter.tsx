import { useState, useEffect, useRef } from "react";
import { ArrowDownUp, Search, X, History, Calculator, DollarSign, ArrowLeft } from "lucide-react";

interface ExchangeRates {
  [key: string]: number;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

interface CurrencyConverterProps {
  onOpenHistory?: () => void;
  mode?: "calculator" | "currency";
  onModeChange?: (mode: "calculator" | "currency") => void;
}

type RestCountry = {
  name?: { common?: string };
  flag?: string;
  cca2?: string;
  currencies?: {
    [code: string]: {
      name?: string;
      symbol?: string;
    };
  };
};

const normalizeRates = (rates: ExchangeRates | null | undefined): ExchangeRates => {
  if (!rates) return {};
  return Object.fromEntries(
    Object.entries(rates).map(([code, value]) => [code.toUpperCase(), value])
  );
};

const baseCurrencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", flag: "🇵🇰" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", flag: "🇵🇱" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", flag: "🇨🇿" },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪", flag: "🇮🇱" },
  { code: "CLP", name: "Chilean Peso", symbol: "$", flag: "🇨🇱" },
  { code: "ARS", name: "Argentine Peso", symbol: "$", flag: "🇦🇷" },
  { code: "COP", name: "Colombian Peso", symbol: "$", flag: "🇨🇴" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/", flag: "🇵🇪" },
  { code: "EGP", name: "Egyptian Pound", symbol: "£", flag: "🇪🇬" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺" },
  { code: "RON", name: "Romanian Leu", symbol: "lei", flag: "🇷🇴" },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв", flag: "🇧🇬" },
  { code: "HRK", name: "Croatian Kuna", symbol: "kn", flag: "🇭🇷" },
  { code: "ISK", name: "Icelandic Króna", symbol: "kr", flag: "🇮🇸" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", flag: "🇺🇦" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", flag: "🇧🇩" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "₨", flag: "🇱🇰" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "₨", flag: "🇳🇵" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", flag: "🇰🇼" },
  { code: "BHD", name: "Bahraini Dinar", symbol: "د.ب", flag: "🇧🇭" },
  { code: "OMR", name: "Omani Rial", symbol: "﷼", flag: "🇴🇲" },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼", flag: "🇶🇦" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", flag: "🇬🇭" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "د.م.", flag: "🇲🇦" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$", flag: "🇹🇼" },
];

const CurrencyConverter = ({ onOpenHistory, mode, onModeChange }: CurrencyConverterProps = {}) => {
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("INR");
  const [rates, setRates] = useState<ExchangeRates>({});
  const [result, setResult] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(true);
  const [pairLoading, setPairLoading] = useState<boolean>(false);
  const [pairRate, setPairRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [showCurrencyPicker, setShowCurrencyPicker] = useState<boolean>(false);
  const [selectingFor, setSelectingFor] = useState<"from" | "to">("from");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currencies, setCurrencies] = useState<Currency[]>(baseCurrencies);
  const [currenciesLoading, setCurrenciesLoading] = useState<boolean>(true);
  const [currencyError, setCurrencyError] = useState<string | null>(null);

  const pairRateCacheRef = useRef<Map<string, { rate: number; date?: string }>>(new Map());

  const formatUpdated = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const fetchPairRate = async (from: string, to: string) => {
    const fromUpper = from.toUpperCase();
    const toUpper = to.toUpperCase();
    const fromLower = from.toLowerCase();
    const toLower = to.toLowerCase();
    const today = new Date().toISOString().split('T')[0];

    const providers = [
      {
        name: "exchangerate-api-pair",
        url: `https://open.er-api.com/v6/latest/${fromUpper}`,
        extract: (data: any) => {
          const normalized = normalizeRates(data?.rates as ExchangeRates);
          return normalized?.[toUpper];
        },
        extractDate: (data: any) =>
          data?.time_last_update_utc
            ? new Date(data.time_last_update_utc).toISOString()
            : undefined,
      },
      {
        name: "fawazahmed-currency-api-latest",
        url: `https://latest.currency-api.pages.dev/v1/currencies/${fromLower}.json`,
        extract: (data: any) => data?.[fromLower]?.[toLower],
        extractDate: (data: any) => data?.date as string | undefined,
      },
      {
        name: "fawazahmed-currency-api-jsdelivr-latest",
        url: `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromLower}.json`,
        extract: (data: any) => data?.[fromLower]?.[toLower],
        extractDate: (data: any) => data?.date as string | undefined,
      },
      {
        name: "fawazahmed-currency-api-dated",
        url: `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${today}/v1/currencies/${fromLower}.json`,
        extract: (data: any) => data?.[fromLower]?.[toLower],
        extractDate: (data: any) => data?.date as string | undefined,
      },
    ];

    for (const provider of providers) {
      try {
        const res = await fetch(provider.url, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        if (!res.ok) throw new Error(`${provider.name} responded ${res.status}`);
        const data = await res.json();
        const raw = provider.extract(data);
        const parsed = typeof raw === 'number' ? raw : typeof raw === 'string' ? parseFloat(raw) : NaN;
        if (Number.isFinite(parsed) && parsed > 0) {
          return { rate: parsed, date: provider.extractDate(data), provider: provider.name };
        }
      } catch (err) {
        console.warn(`Pair provider ${provider.name} failed`, err);
      }
    }

    throw new Error("Rate unavailable across pair providers");
  };

  // Pull latest ISO-4217 currencies with flags so we cover every country automatically.
  useEffect(() => {
    let cancelled = false;
    const loadCurrencies = async () => {
      try {
        setCurrenciesLoading(true);
        const res = await fetch("https://restcountries.com/v3.1/all?fields=currencies,flag,cca2,name");
        const data: RestCountry[] = await res.json();

        const map = new Map<string, Currency>();

        // Start with base list so major currencies always exist
        baseCurrencies.forEach((curr) => map.set(curr.code, curr));

        data.forEach((country) => {
          const flag = country.flag || "🏳️";
          const countryName = country.name?.common ?? "";
          if (!country.currencies) return;

          Object.entries(country.currencies).forEach(([code, meta]) => {
            if (map.has(code)) return;
            map.set(code, {
              code,
              name: meta.name || countryName || code,
              symbol: meta.symbol || code,
              flag,
            });
          });
        });

        const merged = Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
        if (!cancelled) {
          setCurrencies(merged);
          setCurrencyError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setCurrencyError("Could not load full currency list. Showing defaults.");
          setCurrencies(baseCurrencies);
        }
      } finally {
        if (!cancelled) setCurrenciesLoading(false);
      }
    };

    loadCurrencies();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch exchange rates using USD as base for accurate cross-currency conversion
  const fetchRates = async () => {
    console.log("🚀 Starting fetchRates...");
    setLoading(true);

    const RATES_CACHE_KEY = "currencyRatesUSD_v2";

    // Try the most reliable API first
    try {
      console.log("📡 Fetching from open.er-api.com...");
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      console.log("📡 Response status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("📡 Data received, rates count:", Object.keys(data?.rates || {}).length);
        
        if (data?.rates && Object.keys(data.rates).length > 30) {
          const normalized = normalizeRates(data.rates);
          normalized['USD'] = 1;
          
          console.log("✅ Rates loaded successfully!");
          console.log("   USD:", normalized['USD'], "INR:", normalized['INR'], "EUR:", normalized['EUR'], "GEL:", normalized['GEL']);
          
          setRates(normalized);
          const updated = data.time_last_update_utc ? new Date(data.time_last_update_utc) : new Date();
          setLastUpdated(formatUpdated(updated));
          
          // Cache for offline use
          try {
            localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({ rates: normalized, updated: formatUpdated(updated) }));
          } catch {}
          
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("❌ open.er-api.com failed:", err);
    }

    // Fallback to fawazahmed API
    try {
      console.log("📡 Trying fallback: latest.currency-api.pages.dev...");
      const res = await fetch("https://latest.currency-api.pages.dev/v1/currencies/usd.json");
      
      if (res.ok) {
        const data = await res.json();
        
        if (data?.usd && Object.keys(data.usd).length > 30) {
          const normalized = normalizeRates(data.usd);
          normalized['USD'] = 1;
          
          console.log("✅ Fallback rates loaded!");
          console.log("   USD:", normalized['USD'], "INR:", normalized['INR'], "EUR:", normalized['EUR']);
          
          setRates(normalized);
          setLastUpdated(formatUpdated(new Date(data.date || Date.now())));
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("❌ Fallback API failed:", err);
    }

    // Try localStorage cache
    try {
      const cached = localStorage.getItem(RATES_CACHE_KEY);
      if (cached) {
        const { rates: cachedRates, updated } = JSON.parse(cached);
        if (cachedRates && Object.keys(cachedRates).length > 30) {
          console.log("📦 Using cached rates");
          setRates(cachedRates);
          if (updated) setLastUpdated(updated);
          setLoading(false);
          return;
        }
      }
    } catch {}

    console.error("❌ All rate sources failed!");
    setRates({});
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 300000);
    return () => clearInterval(interval);
  }, []); // Fetch once on mount, no dependency on fromCurrency since we use USD base

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showCurrencyPicker) return; // Disable when picker is open
      
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleNumberClick(e.key);
      } else if (e.key === ".") {
        e.preventDefault();
        handleDecimal();
      } else if (e.key === "+") {
        e.preventDefault();
        handleOperator("+");
      } else if (e.key === "-") {
        e.preventDefault();
        handleOperator("-");
      } else if (e.key === "*") {
        e.preventDefault();
        handleOperator("×");
      } else if (e.key === "/") {
        e.preventDefault();
        handleOperator("÷");
      } else if (e.key === "%") {
        e.preventDefault();
        handlePercentage();
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleEquals();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [amount, showCurrencyPicker]);

  // Resolve a rate for the selected pair (prefer USD-table, fallback to direct pair API).
  useEffect(() => {
    // Wait for main rates fetch to complete before resolving pair
    if (loading) {
      return;
    }

    let cancelled = false;

    const resolvePairRate = async () => {
      const from = fromCurrency.toUpperCase();
      const to = toCurrency.toUpperCase();

      if (from === to) {
        setPairRate(1);
        setPairLoading(false);
        return;
      }

      // Check if both currencies exist in the USD-base rates table
      const fromRate = rates[from];
      const toRate = rates[to];
      if (typeof fromRate === 'number' && fromRate > 0 && typeof toRate === 'number') {
        const crossRate = toRate / fromRate;
        console.log(`✓ Cross-rate from table: 1 ${from} = ${crossRate} ${to}`);
        setPairRate(crossRate);
        setPairLoading(false);
        return;
      }

      // Fallback: check pair rate cache
      const cacheKey = `${from}->${to}`;
      const cached = pairRateCacheRef.current.get(cacheKey);
      if (cached) {
        setPairRate(cached.rate);
        if (cached.date) setLastUpdated(formatUpdated(new Date(cached.date)));
        setPairLoading(false);
        return;
      }

      // Fallback: fetch direct pair rate from API
      console.log(`⏳ Fetching direct pair rate: ${from} → ${to}`);
      setPairLoading(true);
      try {
        const resolved = await fetchPairRate(from, to);
        if (cancelled) return;
        console.log(`✓ Direct pair rate: 1 ${from} = ${resolved.rate} ${to} (${resolved.provider})`);
        pairRateCacheRef.current.set(cacheKey, { rate: resolved.rate, date: resolved.date });
        setPairRate(resolved.rate);
        if (resolved.date) setLastUpdated(formatUpdated(new Date(resolved.date)));
      } catch (err) {
        console.error(`✗ Failed to get rate for ${from} → ${to}`, err);
        if (!cancelled) setPairRate(null);
      } finally {
        if (!cancelled) setPairLoading(false);
      }
    };

    resolvePairRate();
    return () => {
      cancelled = true;
    };
  }, [fromCurrency, toCurrency, rates, loading]);

  // Calculate conversion using resolved pair rate
  useEffect(() => {
    const amountNum = parseFloat(amount);
    if (!amount || Number.isNaN(amountNum)) {
      setResult("0");
      return;
    }

    if (pairRate && pairRate > 0) {
      setResult((amountNum * pairRate).toFixed(2));
      return;
    }

    setResult("Rate unavailable");
  }, [amount, pairRate]);

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setAmount("1");
  };

  const handleNumberClick = (num: string) => {
    setAmount((prev) => {
      if (prev === "0" || prev === "1" && amount.length === 1) return num;
      return prev + num;
    });
  };

  const handleOperator = (op: string) => {
    setAmount((prev) => {
      return prev + " " + op + " ";
    });
  };

  const handleEquals = () => {
    setAmount((prev) => {
      try {
        const sanitized = prev.replace(/×/g, "*").replace(/÷/g, "/").replace(/[^0-9+\-*/.() ]/g, "");
        const result = Function(`"use strict"; return (${sanitized})`)();
        const formattedResult = Number.isInteger(result) 
          ? result.toString() 
          : parseFloat(result.toFixed(8)).toString();
        return formattedResult;
      } catch {
        return prev;
      }
    });
  };

  const handlePercentage = () => {
    setAmount((prev) => {
      try {
        const current = parseFloat(prev);
        if (!isNaN(current)) {
          return (current / 100).toString();
        }
        return prev;
      } catch {
        return prev;
      }
    });
  };

  const handleDecimal = () => {
    setAmount((prev) => {
      const currentSegment = prev.split(/[+\-×÷]/).pop()?.trim() ?? prev;
      if (currentSegment.includes(".")) return prev;
      return prev + ".";
    });
  };

  const handleClear = () => {
    setAmount("1");
  };

  const handleBackspace = () => {
    setAmount((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      }
      return "1";
    });
  };

  const handleCurrencySelect = (code: string) => {
    if (selectingFor === "from") {
      setFromCurrency(code);
    } else {
      setToCurrency(code);
    }
    setShowCurrencyPicker(false);
    setSearchQuery("");
  };

  const openCurrencyPicker = (type: "from" | "to") => {
    setSelectingFor(type);
    setShowCurrencyPicker(true);
  };

  // Filter currencies: exclude the currently selected one and apply search
  const filteredCurrencies = currencies.filter((curr) => {
    // Exclude the currency that's already selected in the other field
    const excludeCode = selectingFor === "from" ? toCurrency : fromCurrency;
    if (curr.code === excludeCode) return false;
    
    // Apply search filter
    const matchesSearch =
      curr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      curr.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const getCurrency = (code: string) => currencies.find((c) => c.code === code);
  const fromCurr = getCurrency(fromCurrency);
  const toCurr = getCurrency(toCurrency);

  if (showCurrencyPicker) {
    const currentSelection = selectingFor === "from" ? fromCurrency : toCurrency;
    return (
      <>
        {/* Desktop overlay backdrop */}
        <div 
          className="hidden sm:block fixed inset-0 z-[59] bg-black/50 backdrop-blur-sm"
          onClick={() => setShowCurrencyPicker(false)}
        />
        
        <div className="fixed inset-0 pt-14 sm:pt-0 z-[60] flex flex-col bg-background sm:static sm:absolute sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[420px] sm:max-h-[500px] sm:rounded-2xl sm:border sm:border-border sm:shadow-2xl overflow-hidden">
        {/* Header - mobile with back & code; desktop keeps title + X */}
        <div className="p-4 sm:p-4 sm:bg-transparent bg-background">
          <div className="flex items-center sm:hidden relative">
            <button
              onClick={() => setShowCurrencyPicker(false)}
              className="p-2 hover:opacity-70 active:opacity-50 transition-opacity z-10"
              aria-label="Back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <span className="absolute inset-0 flex items-center justify-center text-base font-semibold text-muted-foreground">Currencies</span>
          </div>
          <div className="hidden sm:flex items-center justify-between">
            <h2 className="text-lg font-semibold">Currencies</h2>
            <button
              onClick={() => setShowCurrencyPicker(false)}
              className="p-2 rounded-md bg-muted/70 border border-border shadow-sm hover:bg-muted/80 active:bg-muted/90 transition-colors"
              aria-label="Close currency picker"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="border-t border-border sm:bg-transparent bg-background" aria-hidden />

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/40 rounded-md border border-primary/60 pl-10 pr-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Currency List */}
        <div className="flex-1 overflow-y-auto">
          {currenciesLoading && (
            <p className="px-4 py-3 text-sm text-muted-foreground">Loading currencies…</p>
          )}
          {currencyError && !currenciesLoading && (
            <p className="px-4 py-3 text-sm text-destructive">{currencyError}</p>
          )}
          {!currenciesLoading && filteredCurrencies.length === 0 && (
            <p className="px-4 py-3 text-sm text-muted-foreground">No matches found.</p>
          )}
          {!currenciesLoading && filteredCurrencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => handleCurrencySelect(curr.code)}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 active:bg-muted transition-colors"
            >
              <span className="text-4xl">{curr.flag}</span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground">{curr.name}</p>
              </div>
              <span className="text-muted-foreground font-semibold">{curr.code}</span>
            </button>
          ))}
        </div>
      </div>
      </>
    );
  }

  return (
    <div className="flex-1 flex flex-col sm:glass-card sm:rounded-2xl md:rounded-3xl p-0 overflow-hidden">
      {/* Currency Display Section */}
      <div className="flex-1 flex flex-col">
        {/* From Currency */}
        <button
          onClick={() => openCurrencyPicker("from")}
          className="flex items-center gap-4 p-6 sm:p-4 border-b-2 border-border hover:bg-muted/30 transition-colors bg-muted/20 sm:bg-transparent"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-5xl sm:text-4xl">{fromCurr?.flag}</span>
            <span className="text-sm font-semibold text-muted-foreground">{fromCurrency}</span>
          </div>
          <div className="flex-1 text-right">
            <p className="text-5xl sm:text-3xl md:text-4xl font-bold text-foreground">{amount}</p>
          </div>
        </button>

        {/* To Currency */}
        <button
          onClick={() => openCurrencyPicker("to")}
          className="flex items-center gap-4 p-6 sm:p-4 border-b-2 border-border hover:bg-muted/30 transition-colors bg-muted/20 sm:bg-muted/10"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-5xl sm:text-4xl">{toCurr?.flag}</span>
            <span className="text-sm font-semibold text-muted-foreground">{toCurrency}</span>
          </div>
          <div className="flex-1 text-right">
            <p className="text-5xl sm:text-3xl md:text-4xl font-bold text-foreground">
              {loading || pairLoading ? "..." : result}
            </p>
          </div>
        </button>
      </div>

      {/* Mobile Bottom Navigation - Above Keypad */}
      <div className="sm:hidden bg-background border-b-2 border-border px-6 py-3 flex items-center justify-around">
        <button
          onClick={onOpenHistory}
          className="p-3 rounded-full hover:bg-muted/30 transition-colors"
          aria-label="History"
        >
          <History className="w-6 h-6 text-foreground" />
        </button>
        <button
          onClick={() => onModeChange?.("calculator")}
          className={`p-3 rounded-full transition-colors ${
            mode === "calculator" ? "bg-primary/20" : "hover:bg-muted/30"
          }`}
          aria-label="Calculator"
        >
          <Calculator className={`w-6 h-6 ${mode === "calculator" ? "text-primary" : "text-foreground"}`} />
        </button>
        <button
          onClick={() => onModeChange?.("currency")}
          className={`p-3 rounded-full transition-colors ${
            mode === "currency" ? "bg-primary/20" : "hover:bg-muted/30"
          }`}
          aria-label="Currency Converter"
        >
          <DollarSign className={`w-6 h-6 ${mode === "currency" ? "text-primary" : "text-foreground"}`} />
        </button>
      </div>

      {/* Number Pad */}
      <div className="px-4 pt-4 pb-4 sm:p-3 bg-background">
        <div className="grid grid-cols-4 gap-2">
          {/* Row 1 */}
          <button onClick={handleClear} className="rounded-2xl sm:rounded-xl h-14 sm:h-12 text-xl font-semibold bg-destructive/80 text-destructive-foreground hover:bg-destructive active:brightness-95 transition-colors">
            C
          </button>
          <button onClick={handleBackspace} className="rounded-2xl sm:rounded-xl h-14 sm:h-12 text-xl font-semibold bg-primary/80 text-primary-foreground hover:bg-primary active:brightness-95 transition-colors">
            ←
          </button>
          <button onClick={handleSwapCurrencies} className="rounded-2xl sm:rounded-xl h-14 sm:h-12 bg-accent text-accent-foreground hover:brightness-110 active:brightness-95 transition-colors">
            <ArrowDownUp className="w-5 h-5 mx-auto" />
          </button>
          <button onClick={() => handleOperator("÷")} className="calc-operator rounded-xl h-14 sm:h-12 text-2xl">
            ÷
          </button>

          {/* Row 2 */}
          <button onClick={() => handleNumberClick("7")} className="calc-button rounded-xl h-14 sm:h-12 text-2xl">
            7
          </button>
          <button onClick={() => handleNumberClick("8")} className="calc-button rounded-xl h-14 sm:h-12 text-2xl">
            8
          </button>
          <button onClick={() => handleNumberClick("9")} className="calc-button rounded-xl h-14 sm:h-12 text-2xl">
            9
          </button>
          <button onClick={() => handleOperator("×")} className="calc-operator rounded-xl h-14 sm:h-12 text-2xl">
            ×
          </button>

          {/* Row 3 */}
          <button onClick={() => handleNumberClick("4")} className="calc-button rounded-xl h-14 sm:h-12 text-2xl">
            4
          </button>
          <button onClick={() => handleNumberClick("5")} className="calc-button rounded-xl h-14 sm:h-12 text-2xl">
            5
          </button>
          <button onClick={() => handleNumberClick("6")} className="calc-button rounded-xl h-14 sm:h-12 text-2xl">
            6
          </button>
          <button onClick={() => handleOperator("-")} className="calc-operator rounded-xl h-14 sm:h-12 text-2xl">
            -
          </button>

          {/* Row 4 */}
          <button onClick={() => handleNumberClick("1")} className="calc-button rounded-xl h-14 sm:h-12 text-2xl">
            1
          </button>
          <button onClick={() => handleNumberClick("2")} className="calc-button rounded-xl h-14 sm:h-12 text-2xl">
            2
          </button>
          <button onClick={() => handleNumberClick("3")} className="calc-button rounded-xl h-14 sm:h-12 text-2xl">
            3
          </button>
          <button onClick={() => handleOperator("+")} className="calc-operator rounded-xl h-14 sm:h-12 text-2xl">
            +
          </button>

          {/* Row 5 */}
          <button onClick={() => handleNumberClick("0")} className="calc-button rounded-xl h-14 sm:h-12 text-2xl">
            0
          </button>
          <button onClick={handleDecimal} className="calc-button rounded-xl h-14 sm:h-12 text-2xl">
            .
          </button>
          <button onClick={handlePercentage} className="calc-button rounded-xl h-14 sm:h-12 text-xl">
            %
          </button>
          <button onClick={handleEquals} className="calc-equals rounded-xl h-14 sm:h-12 text-2xl">
            =
          </button>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="pt-4 pb-10 px-3 sm:p-4 border-t border-border bg-background/50">
        <div className="space-y-1">
          {pairRate !== null && fromCurrency !== toCurrency && !loading && !pairLoading && result !== "Rate unavailable" && (
            <p className="text-xs text-muted-foreground text-center mb-1.5">
              {lastUpdated} • 1 {fromCurrency} = {pairRate.toFixed(4)} {toCurrency}
            </p>
          )}
          <p className="hidden sm:block text-xs text-muted-foreground text-center">
            You can use your keyboard to type numbers and operators
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
