import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/home';
import CharacterCreator from './pages/character-creator';
import Spells from './pages/spells';
import Dmg from './pages/dmg'

const App = () => {

  const [theme, setTheme] = useState("light");

  // Load the theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.className = savedTheme; // Set initial theme on body
  }, []);

  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <Router>
        <nav className={`top-menu`}>
          <button onClick={toggleMenu} className={`button ${theme}`} style={{borderRadius: '5px'}}>
            {menuOpen ? 'Hide Pages' : 'Show Pages'}
          </button>
          {menuOpen && (
            <div>
              <ul style={{fontSize: '15px'}}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/char-creator">Character Creator</Link></li>
                <li><Link to="/spells">Spells</Link></li>
                <li><Link to="/dmg">DMG</Link></li>
              </ul>
            </div>
          )}
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/char-creator" element={<CharacterCreator />} />
          <Route path="/spells" element={<Spells />} />
          <Route path="/dmg" element={<Dmg />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

