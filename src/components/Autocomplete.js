import React, { useEffect, useState } from "react";

const Autocomplete = ({ filler, onChange, newSuggestions, display, _c }) => {

  const [theme, setTheme] = useState("light");

  // Load the theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.className = savedTheme; // Set initial theme on body
  }, []);

  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [c, setC] = useState(false);

  useEffect(() => {
    if (newSuggestions) {
        setSuggestions(newSuggestions);
    }
    if (display) {
      setQuery(display);
    }
    else {
      setQuery("");
    }
    if (_c) {
      setC(_c);
    }
    else {
      setC(false);
    }
  }, [newSuggestions, display, _c]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setQuery(input);
    onChange(input);

    if (input) {
      const matches = suggestions.filter((item) =>
        c ? item.toLowerCase().includes(input.toLowerCase()) : item.toLowerCase().startsWith(input.toLowerCase())
      );
      setFilteredSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="autocomplete-container">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={filler}
          className={`autocomplete-input ${theme}`}
          style={{width: '90%'}}
        />
      
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className={`autocomplete-suggestions ${theme}`}>
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`autocomplete-suggestion ${theme}`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default Autocomplete;