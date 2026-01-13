import { useState } from 'react';
import { useBooks } from '../contexts/BooksContext';
import { useAuth } from '../contexts/AuthContext';
import { settingsApi } from '../api';
import Hero from '../components/Hero/Hero';
import QuoteCard from '../components/QuoteCard/QuoteCard';
import BookList from '../components/BookList/BookList';
import styles from './Home.module.scss';

export default function Home() {
    const { books, loading, error } = useBooks();
    const { token } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    const handleTestEmail = async () => {
        if (!confirm('Send test email now?')) return;
        try {
            const data = await settingsApi.triggerTestEmail(token);
            alert(data.message || 'Email triggered!');
        } catch (err) {
            console.error(err);
            alert('Failed to trigger email');
        }
    };

    if (loading && books.length === 0) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Filter books based on search term
    const filteredBooks = books.filter(book =>
        book.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.Author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Hero />

            <QuoteCard books={books} />

            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />

                <div className={styles.filtersWrapper}>
                    {/* Add Filter buttons here later if needed */}
                </div>
            </div>

            {books.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No books added yet. Click "Add New Book" to get started!</p>
                </div>
            ) : filteredBooks.length === 0 ? (
                <p>No books found matching "{searchTerm}"</p>
            ) : (
                <BookList books={filteredBooks} />
            )}
        </div>
    );
}
