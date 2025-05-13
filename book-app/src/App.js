import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import pages
import Dashboard from './pages/Dashboard';
import BookList from './pages/BookList';
import AddEditBook from './pages/AddEditBook';
import BookDetails from './pages/BookDetails';
import ReadingList from './pages/ReadingList';

// Import components
import Navbar from './components/Navbar';
import QuickActions from './components/QuickActions';

const API_BASE = 'http://localhost:3001/api/books';

function App() {
  // State declarations - consolidated
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    fetchBooks(pagination.currentPage, limit);
  }, [pagination.currentPage, limit]);

  const fetchBooks = async (page = 1, itemsPerPage = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}?page=${page}&limit=${itemsPerPage}`);
      // Check if the response has the expected structure
      if (res.data.books) {
        setBooks(res.data.books);
      } else {
        // If the server doesn't return books in the expected format, assume the response is the books array
        setBooks(res.data);
      }
      
      // Check if pagination data exists in the response
      if (res.data.pagination) {
        setPagination(res.data.pagination);
      } else {
        // Set default pagination if not provided by the server
        setPagination({
          currentPage: page,
          totalPages: 1,
          totalBooks: res.data.books ? res.data.books.length : res.data.length,
          hasNextPage: false,
          hasPrevPage: page > 1
        });
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to load books. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add pagination navigation functions
  const goToNextPage = () => {
    if (pagination.hasNextPage) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const goToPrevPage = () => {
    if (pagination.hasPrevPage) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  };
  
  // After adding or updating a book, refresh the current page
  const refreshCurrentPage = () => {
    fetchBooks(pagination.currentPage, limit);
  };

  // Update handleDelete to refresh after deletion
  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE}/${id}`);
      // Refresh the current page to show updated data
      refreshCurrentPage();
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Failed to delete book. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique genres for filter dropdown
  const genres = [...new Set(books.filter(book => book.genre).map(book => book.genre))];

  // Filter and search books
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = filterGenre ? book.genre === filterGenre : true;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="app-container">
      <Navbar />
      
      <main>
        {error && (
          <div className="error-message">
            <p>Error</p>
            <p>{error}</p>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Dashboard books={books} />} />
          <Route 
            path="/books" 
            element={
              <BookList 
                books={filteredBooks} 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterGenre={filterGenre}
                setFilterGenre={setFilterGenre}
                genres={genres}
                handleDelete={handleDelete}
                isLoading={isLoading}
                pagination={pagination}
                goToNextPage={goToNextPage}
                goToPrevPage={goToPrevPage}
                limit={limit}
                setLimit={setLimit}
              />
            } 
          />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/add-book" element={<AddEditBook refreshBooks={refreshCurrentPage} />} />
          <Route path="/edit-book/:id" element={<AddEditBook refreshBooks={refreshCurrentPage} />} />
          <Route path="/reading-list" element={<ReadingList books={books} />} />
        </Routes>
      </main>
      
      <QuickActions />
    </div>
  );
}

export default App;
