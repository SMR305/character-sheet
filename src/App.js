import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/home';
import CharacterCreator from './pages/character-creator';
import Spells from './pages/spells';

const App = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <Router>
        <nav style={menuOpen ? { border: '1px solid black', padding: '10px', backgroundColor: '#f0f0f0' } : {}}>
          <button onClick={toggleMenu} className={'button'} style={{borderRadius: '0px'}}>
            {menuOpen ? 'Hide Pages' : 'Show Pages'}
          </button>
          {menuOpen && (
            <div>
              <ul style={{fontSize: '15px'}}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/char-creator">Character Creator</Link></li>
                <li><Link to="/spells">Spells</Link></li>
              </ul>
            </div>
          )}
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/char-creator" element={<CharacterCreator />} />
          <Route path="/spells" element={<Spells />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

