import React, { useEffect, useState } from 'react';
import Entry from '../components/Entry';

const Book = ({_book}) => {
    const book = _book;

    const [theme, setTheme] = useState("light");

    // Load the theme from localStorage on initial render
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.body.className = savedTheme; // Set initial theme on body
    }, []);

    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const book_info = await import(`../books/${book}.json`);
                setData(book_info);
            }
            catch (error) {
                console.error('Error fetching book:', error);
            }
        };

        fetchBook();
    }, [book]);

    if (!data) {
        return <div className={`container ${theme}`}><h1>Loading...</h1></div>;
    }

    return (
        <div className={``}>
            {data.data.map((section) => (
                <Entry key={section.id} entry={section} />
            ))}
        </div>
    );
};

export default Book;