import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currencies, setCurrencies] = useState({}); 
  const [loading, setLoading] = useState(true);

  // 1. Загрузка списка валют 
  useEffect(() => {
    fetch('https://api.frankfurter.dev/v1/currencies')
      .then((res) => res.json())
      .then((data) => {
        setCurrencies(data);
        setLoading(false);
      })
      .catch((err) => console.error("Ошибка загрузки валют:", err));
  }, []);

  // 2. Получение курса
  useEffect(() => {
    if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
      setExchangeRate(1);
      return;
    }

    setLoading(true);
    fetch(`https://api.frankfurter.dev/v1/latest?from=${fromCurrency}&to=${toCurrency}`)
      .then((res) => res.json())
      .then((data) => {
        setExchangeRate(data.rates[toCurrency]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки курса:", err);
        setLoading(false);
      });
  }, [fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertedAmount = exchangeRate ? (amount * exchangeRate).toFixed(2) : '';

  return (
    <div className="app-container">
      <div className="converter-wrapper">
        
        <header className="header">
          <h1>Конвертер валют</h1>
          <p>Актуальные курсы на сегодня</p>
        </header>
        
        <div className="converter-card">
          {/* Поле ввода суммы */}
          <div className="input-group">
            <label>Сумма</label>
            <div className="input-wrapper">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                placeholder="Введите сумму"
              />
              <span className="currency-symbol">{fromCurrency}</span>
            </div>
          </div>

          {/* Выбор валют */}
          <div className="currency-row">
            <div className="select-group">
              <label>Из</label>
              <div className="custom-select">
                <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                  {Object.entries(currencies).map(([code, name]) => (
                    <option key={code} value={code}>
                      {code} — {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button className="swap-btn" onClick={swapCurrencies} title="Поменять местами">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"/>
              </svg>
            </button>

            <div className="select-group">
              <label>В</label>
              <div className="custom-select">
                <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                  {Object.entries(currencies).map(([code, name]) => (
                    <option key={code} value={code}>
                      {code} — {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Результат */}
          <div className="result-box">
            {loading ? (
              <div className="skeleton-loader"></div>
            ) : (
              <>
                <div className="result-main">
                  <span className="result-amount">{amount}</span>
                  <span className="result-from">{fromCurrency}</span>
                  <span className="result-equals">=</span>
                  <span className="result-converted">{convertedAmount}</span>
                  <span className="result-to">{toCurrency}</span>
                </div>
                {exchangeRate && (
                  <p className="rate-info">
                    1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
        
        <footer className="footer">
          <p>Данные предоставлены Frankfurter API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;