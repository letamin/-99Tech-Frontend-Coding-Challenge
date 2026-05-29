import { useMemo, useState, useRef, useEffect } from "react";
import "./CurrencySwapForm.css";

import { TokenPrice } from "./types";
import { tokenPrices } from "./tokenPrice";

const SWAP_CONFIG = {
  PRECISION: {
    DISPLAY_DECIMALS: 6,
    MIN_INPUT_STEP: "any",
  },
  FALLBACKS: {
    FROM_TICKER: "ETH",
    TO_TICKER: "USDC",
    EMPTY_VALUE: "",
    MIN_VAL: 0,
    TOKEN_ICON: "/tokens/fallback.svg",
  },
  MOCK_DELAY_MS: 1500,
  MESSAGE_VISIBLE_MS: 4000,
};

export default function CurrencySwapForm() {
  const [amount, setAmount] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pricesMap = useMemo(() => {
    const map = new Map<string, TokenPrice>();

    tokenPrices.forEach((token) => {
      const existing = map.get(token.currency);

      if (!existing || new Date(token.date) > new Date(existing.date)) {
        map.set(token.currency, token);
      }
    });

    return map;
  }, []);

  const tokenList = useMemo(() => Array.from(pricesMap.values()), [pricesMap]);

  const initialFromCurrency = useMemo(() => {
    if (pricesMap.has(SWAP_CONFIG.FALLBACKS.FROM_TICKER)) {
      return SWAP_CONFIG.FALLBACKS.FROM_TICKER;
    }

    return tokenList[0]?.currency ?? SWAP_CONFIG.FALLBACKS.EMPTY_VALUE;
  }, [pricesMap, tokenList]);

  const initialToCurrency = useMemo(() => {
    if (pricesMap.has(SWAP_CONFIG.FALLBACKS.TO_TICKER)) {
      return SWAP_CONFIG.FALLBACKS.TO_TICKER;
    }

    return (
      tokenList[1]?.currency ??
      tokenList[0]?.currency ??
      SWAP_CONFIG.FALLBACKS.EMPTY_VALUE
    );
  }, [pricesMap, tokenList]);

  const [fromCurrency, setFromCurrency] = useState<string>(initialFromCurrency);
  const [toCurrency, setToCurrency] = useState<string>(initialToCurrency);

  const fromPrice = pricesMap.get(fromCurrency)?.price;
  const toPrice = pricesMap.get(toCurrency)?.price;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleIconError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    event.currentTarget.src = SWAP_CONFIG.FALLBACKS.TOKEN_ICON;
  };

  const clearSystemMessages = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (errorMessage) {
      setErrorMessage(SWAP_CONFIG.FALLBACKS.EMPTY_VALUE);
    }

    if (successMessage) {
      setSuccessMessage(SWAP_CONFIG.FALLBACKS.EMPTY_VALUE);
    }
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
    clearSystemMessages();
  };

  const handleFromCurrencyChange = (value: string) => {
    if (value === toCurrency) {
      setToCurrency(fromCurrency);
    }

    setFromCurrency(value);
    clearSystemMessages();
  };

  const handleToCurrencyChange = (value: string) => {
    if (value === fromCurrency) {
      setFromCurrency(toCurrency);
    }

    setToCurrency(value);
    clearSystemMessages();
  };

  const outputAmount = useMemo(() => {
    const numericAmount = Number(amount);

    if (
      !numericAmount ||
      numericAmount <= SWAP_CONFIG.FALLBACKS.MIN_VAL ||
      !fromPrice ||
      !toPrice
    ) {
      return SWAP_CONFIG.FALLBACKS.EMPTY_VALUE;
    }

    return ((numericAmount * fromPrice) / toPrice).toFixed(
      SWAP_CONFIG.PRECISION.DISPLAY_DECIMALS,
    );
  }, [amount, fromPrice, toPrice]);

  const exchangeRate = useMemo(() => {
    if (!fromPrice || !toPrice) {
      return SWAP_CONFIG.FALLBACKS.EMPTY_VALUE;
    }

    return `1 ${fromCurrency} = ${(fromPrice / toPrice).toFixed(
      SWAP_CONFIG.PRECISION.DISPLAY_DECIMALS,
    )} ${toCurrency}`;
  }, [fromCurrency, toCurrency, fromPrice, toPrice]);

  const getCurrencyIcon = (currency: string) => {
    return `/tokens/${currency.toLowerCase()}.svg`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setErrorMessage(SWAP_CONFIG.FALLBACKS.EMPTY_VALUE);
    setSuccessMessage(SWAP_CONFIG.FALLBACKS.EMPTY_VALUE);

    const numericAmount = Number(amount);

    if (
      !amount.trim() ||
      Number.isNaN(numericAmount) ||
      numericAmount <= SWAP_CONFIG.FALLBACKS.MIN_VAL
    ) {
      setErrorMessage(
        `Please enter a valid amount greater than ${SWAP_CONFIG.FALLBACKS.MIN_VAL}.`,
      );

      return;
    }

    if (!fromPrice || !toPrice) {
      setErrorMessage(
        "Market execution failure: Pricing feeds are unavailable.",
      );

      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, SWAP_CONFIG.MOCK_DELAY_MS),
      );

      setSuccessMessage(
        `Successfully swapped ${amount} ${fromCurrency} to ${outputAmount} ${toCurrency}.`,
      );

      timeoutRef.current = setTimeout(() => {
        setSuccessMessage(SWAP_CONFIG.FALLBACKS.EMPTY_VALUE);
        timeoutRef.current = null;
      }, SWAP_CONFIG.MESSAGE_VISIBLE_MS);
    } catch {
      setErrorMessage(
        "An unexpected transmission error occurred. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="swap">
      <form className="swap__card" onSubmit={handleSubmit}>
        <h2 className="swap__title">Swap Assets</h2>

        <div className="swap__field">
          <label className="swap__label">Amount to send</label>

          <div
            className={`swap__input-group ${
              errorMessage ? "swap__input-group--error" : ""
            }`}
          >
            <input
              type="number"
              min={SWAP_CONFIG.FALLBACKS.MIN_VAL}
              step={SWAP_CONFIG.PRECISION.MIN_INPUT_STEP}
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              disabled={isSubmitting}
              className="swap__input"
            />

            <div className="swap__currency-select">
              <img
                src={getCurrencyIcon(fromCurrency)}
                alt={fromCurrency}
                onError={handleIconError}
                className="swap__currency-icon"
              />

              <select
                value={fromCurrency}
                onChange={(e) => handleFromCurrencyChange(e.target.value)}
                disabled={isSubmitting}
                className="swap__select"
              >
                {tokenList.map((token) => (
                  <option key={token.currency} value={token.currency}>
                    {token.currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setFromCurrency(toCurrency);
            setToCurrency(fromCurrency);
            clearSystemMessages();
          }}
          disabled={isSubmitting}
          className="swap__switch-button"
          aria-label="Switch currencies"
        >
          ⇅
        </button>

        <div className="swap__field">
          <label className="swap__label">Amount to receive</label>

          <div className="swap__input-group">
            <input
              type="text"
              value={outputAmount}
              readOnly
              placeholder="0.00"
              className="swap__input"
            />

            <div className="swap__currency-select">
              <img
                src={getCurrencyIcon(toCurrency)}
                alt={toCurrency}
                onError={handleIconError}
                className="swap__currency-icon"
              />

              <select
                value={toCurrency}
                onChange={(e) => handleToCurrencyChange(e.target.value)}
                disabled={isSubmitting}
                className="swap__select"
              >
                {tokenList.map((token) => (
                  <option key={token.currency} value={token.currency}>
                    {token.currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {exchangeRate && <div className="swap__rate">{exchangeRate}</div>}
        {errorMessage && <div className="swap__error">{errorMessage}</div>}

        <div
          className={`swap__success-wrapper ${
            successMessage ? "swap__success-wrapper--visible" : ""
          }`}
        >
          <div className="swap__success">{successMessage}</div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`swap__submit-button ${
            isSubmitting ? "swap__submit-button--loading" : ""
          }`}
        >
          {isSubmitting ? (
            <span className="swap__spinner-container">
              <span className="swap__spinner" />
              Processing transaction...
            </span>
          ) : (
            "CONFIRM SWAP"
          )}
        </button>
      </form>
    </div>
  );
}
