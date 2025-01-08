import React, { useEffect, useState } from 'react';
import Entry from '../components/Entry';

const Dmg = () => {

    const [theme, setTheme] = useState("light");

    // Load the theme from localStorage on initial render
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.body.className = savedTheme; // Set initial theme on body
    }, []);

    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('/book-dmg.json')
            .then((response) => response.json())
            .then((data) => setData(data));
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`container ${theme}`}>
            {data.data.map((section) => (
                <Entry key={section.id} entry={section} />
            ))}
        </div>
    );
};

export default Dmg;