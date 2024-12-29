import DailyRoutine from './DailyRoutine';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`app ${theme}`}>
      <div className="theme-toggle-container">
        <button onClick={toggleTheme}>
          {theme === 'light' ? '☀️' : '🌙'}
        </button>
      </div>
      <DailyRoutine />
    </div>
  );
}

export default App;
