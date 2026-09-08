import React, {useState, useEffect} from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Book from './book';
import sources from '../sourceRef'

const Books = () => {

    const [theme, setTheme] = useState("light");
    const bookList = sources.data;

    // Load the theme from localStorage on initial render
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.body.className = savedTheme; // Set initial theme on body
    }, []);

    const [books, setBooks] = useState([]);

    useEffect(() => {
        const bookNames = bookList.map((book) => {
            const id = String(book.id).replace(/^book-/, '');
            return {
                id: `book-${id}`,
                title: book.title || id
            };
        });

        setBooks(bookNames);
    }, [bookList]);

    const loadFromLocalStorage = (key, defaultValue) => {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultValue;
    };

    const [hide, setHide] = useState(loadFromLocalStorage("hide", false));

    useEffect(() => {
        localStorage.setItem("hide", JSON.stringify(hide));
    }, [hide]);

    return(
        <div className={`container ${theme}`}>
            <nav>
                {hide ? <Link className={`text ${theme}`} to={`/books`} onClick={() => setHide(false)}>Back</Link>
                :
                <>
                    <h1>Reference Books</h1>
                    <ul>
                        {books.map(book => (
                            <li key={book.id}>
                                <Link className={`text ${theme}`} to={`${book.id}`} onClick={() => setHide(true)}>{book.title}</Link>
                            </li>
                        ))}
                    </ul>
                </>}
            </nav>
            <Routes>
                {books.map(book => (
                    <Route key={book.id} path={`${book.id}`} element={<Book _book={book} />} />
                ))}
            </Routes>
        </div>
    );
};

export default Books;