import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { booksApi } from '../api';

const BooksContext = createContext();

export function BooksProvider({ children }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const fetchBooks = useCallback(async () => {
        if (!token) return;

        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const data = await booksApi.getAll(token);
            setBooks(data); // Assuming success means no error
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    return (
        <BooksContext.Provider value={{ books, loading, error, fetchBooks }}>
            {children}
        </BooksContext.Provider>
    );
}

export function useBooks() {
    return useContext(BooksContext);
}
