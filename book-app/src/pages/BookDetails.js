import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/books';

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBook = async () => {
      try {
        console.log(`Fetching book with ID: ${id}`);
        const response = await axios.get(`${API_BASE}/${id}`);
        console.log('Book data received:', response.data);
        setBook(response.data);
      } catch (err) {
        // Enhanced error logging
        console.error('Error details:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          id: id,
          endpoint: `${API_BASE}/${id}`
        });
        
        if (err.response && err.response.status === 404) {
          setError(`Unable to find book with ID: ${id}. Please verify the book exists and try again.`);
        } else if (!err.response) {
          setError('Unable to connect to the server. Please check if the backend is running.');
        } else {
          setError(`Failed to load book details. Server returned: ${err.response.statusText}`);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchBook();
    } else {
      setError('Invalid book ID provided.');
      setLoading(false);
    }
  }, [id]);
  
  // Add a retry function
  const retryFetch = () => {
    setLoading(true);
    setError(null);
    fetchBook();
  };
  
  const fetchBook = async () => {
    try {
      console.log(`Fetching book with ID: ${id}`);
      const response = await axios.get(`${API_BASE}/${id}`);
      console.log('Book data received:', response.data);
      setBook(response.data);
    } catch (err) {
      console.error('Error fetching book:', err);
      
      if (err.response && err.response.status === 404) {
        setError(`Unable to find book with ID: ${id}. Please verify the book exists and try again.`);
      } else if (!err.response) {
        setError('Unable to connect to the server. Please check if the backend is running.');
      } else {
        setError(`Failed to load book details. Server returned: ${err.response?.statusText || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading book details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-message">
        <p>Error</p>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={retryFetch} className="btn btn-primary">
            <i className="fas fa-sync"></i> Retry
          </button>
          <Link to="/books" className="btn btn-secondary">Back to Books</Link>
        </div>
      </div>
    );
  }
  
  if (!book) {
    return (
      <div className="error-message">
        <p>Book not found</p>
        <Link to="/books" className="btn btn-primary">Back to Books</Link>
      </div>
    );
  }
  
  return (
    <div className="book-details-page">
      <div className="page-header">
        <h1>Book Details</h1>
        <div className="header-actions">
          <Link to="/books" className="btn btn-secondary">Back to Books</Link>
        </div>
      </div>
      
      <div className="book-details">
        <div className="book-detail-cover">
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={`Cover of ${book.title}`} />
          ) : (
            <div className="no-cover">No Cover Available</div>
          )}
        </div>
        
        <div className="book-detail-info">
          <h2>{book.title}</h2>
          
          <div className="book-detail-meta">
            <span><i className="fas fa-user"></i> {book.author}</span>
            {book.genre && <span><i className="fas fa-tag"></i> {book.genre}</span>}
            {book.publishedYear && <span><i className="fas fa-calendar"></i> {book.publishedYear}</span>}
            <span><i className="fas fa-book-reader"></i> {book.readingStatus}</span>
          </div>
          
          {book.description && (
            <div className="book-description">
              <h3>Description</h3>
              <p>{book.description}</p>
            </div>
          )}
          
          <div className="book-detail-actions">
            <Link to={`/edit-book/${book._id}`} className="btn btn-primary">
              <i className="fas fa-edit"></i> Edit Book
            </Link>
            <button onClick={() => {
              if (window.confirm('Are you sure you want to delete this book?')) {
                axios.delete(`${API_BASE}/${book._id}`)
                  .then(() => navigate('/books'))
                  .catch(err => {
                    console.error('Error deleting book:', err);
                    setError('Failed to delete book. Please try again.');
                  });
              }
            }} className="btn btn-delete">
              <i className="fas fa-trash"></i> Delete Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;