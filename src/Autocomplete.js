import React, { useEffect, useState } from "react";
import "./App.css";

const Autocomplete = ({ filler, onChange, newSuggestions, display }) => {
  const [suggestions, setSuggestions] = useState(["cat", "dog", "bird"]);
  const [query, setQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (newSuggestions) {
        setSuggestions(newSuggestions);
    }
    if (display) {
      setQuery(display);
    }
  }, [newSuggestions, display]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setQuery(input);
    onChange(input);

    if (input) {
      const matches = suggestions.filter((item) =>
        item.toLowerCase().startsWith(input.toLowerCase())
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
        className="autocomplete-input"
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="autocomplete-suggestions">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="autocomplete-suggestion"
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