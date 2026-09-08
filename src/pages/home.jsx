import React, { useState, useEffect } from 'react';

const Home = () => {

  const [theme, setTheme] = useState("light");

  // Load the theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.className = savedTheme; // Set initial theme on body
  }, []);

  // Toggle theme and save it to localStorage
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme; // Update theme on body
  };

  return (
    <div className={`container ${theme}`}>
        <h1> Welcome to Forge and Fantasy</h1>
        <span>
            Forge and Fantasy is a character creation tool for Dungeons and Dragons
            5th edition and 5.5 edition (2024).
        </span>

        <h2 className={`app-container ${theme}`}>{`Current Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}</h2>
        <button className={`button ${theme}`} onClick={toggleTheme}> Switch Mode </button>
    </div>
  );
};

export default Home;