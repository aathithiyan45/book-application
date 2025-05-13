import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api/books';
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

function AddEditBook({ refreshBooks }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isbn, setIsbn] = useState(''); // Add ISBN state
  const [form, setForm] = useState({
    title: '',
    author: '',
    genre: '',
    publishedYear: '',
    description: '',
    coverUrl: '',
    readingStatus: 'unread',
    tags: []
  });

  // Check if we're in edit mode
  const isEditMode = !!id && id !== 'add';

  // Define fetchBookDetails before using it in useEffect
  const fetchBookDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/${id}`);
      if (response.data) {
        setForm({
          title: response.data.title || '',
          author: response.data.author || '',
          genre: response.data.genre || '',
          publishedYear: response.data.publishedYear || '',
          description: response.data.description || '',
          coverUrl: response.data.coverUrl || '',
          readingStatus: response.data.readingStatus || 'unread',
          tags: response.data.tags || []
        });
      }
    } catch (err) {
      console.error('Error fetching book details:', err);
      setError('Failed to load book details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch book details if we're in edit mode and have a valid ID
    if (isEditMode) {
      fetchBookDetails();
    }
  }, [id, isEditMode]); // Remove fetchBookDetails from dependencies

  // Remove the duplicate fetchBookDetails function that appears later

  // Add ISBN lookup function
  const handleIsbnSubmit = async (e) => {
    e.preventDefault();
    if (!isbn.trim()) {
      setError('Please enter an ISBN');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${GOOGLE_BOOKS_API}?q=isbn:${isbn}`);
      if (response.data.items && response.data.items[0]) {
        const book = response.data.items[0].volumeInfo;
        setForm({
          ...form,
          title: book.title || '',
          author: book.authors ? book.authors.join(', ') : '',
          genre: book.categories ? book.categories[0] : '',
          publishedYear: book.publishedDate ? book.publishedDate.substring(0, 4) : '',
          description: book.description || '',
          coverUrl: book.imageLinks ? book.imageLinks.thumbnail : ''
        });
      } else {
        setError('No book found with that ISBN. Please enter details manually.');
      }
    } catch (err) {
      console.error('Error fetching book metadata:', err);
      setError('Failed to fetch book metadata. Please enter details manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditMode) {
        // Update existing book
        await axios.put(`${API_BASE}/${id}`, form);
      } else {
        // Add new book
        await axios.post(API_BASE, form);
      }
      
      // Refresh the book list
      if (refreshBooks) {
        refreshBooks();
      }
      
      // Navigate back to the book list
      navigate('/books');
    } catch (err) {
      console.error('Error saving book:', err);
      setError('Failed to save book. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-section">
      <h2>{isEditMode ? '✏️ Edit Book' : '📖 Add New Book'}</h2>
      
      {error && (
        <div className="error-message">
          <p>Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Add ISBN Lookup Form */}
      <div className="isbn-lookup">
        <h3>📱 Scan ISBN</h3>
        <form onSubmit={handleIsbnSubmit}>
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="Enter ISBN..."
          />
          <button type="submit" disabled={isLoading} className="btn btn-primary">
            {isLoading ? 'Looking up...' : 'Look up ISBN'}
          </button>
        </form>
      </div>
      
      {isLoading && !error ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="required-field">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter book title"
            />
          </div>

          <div className="form-group">
            <label className="required-field">Author</label>
            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              required
              placeholder="Enter author name"
            />
          </div>

          <div className="form-group">
            <label>Genre</label>
            <input
              type="text"
              name="genre"
              value={form.genre}
              onChange={handleChange}
              placeholder="Enter book genre"
            />
          </div>

          <div className="form-group">
            <label>Published Year</label>
            <input
              type="number"
              name="publishedYear"
              value={form.publishedYear}
              onChange={handleChange}
              placeholder="Enter published year"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter book description"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Cover URL</label>
            <input
              type="url"
              name="coverUrl"
              value={form.coverUrl}
              onChange={handleChange}
              placeholder="Enter cover image URL"
            />
            {form.coverUrl && (
              <div className="cover-preview">
                <img src={form.coverUrl} alt="Book cover preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Reading Status</label>
            <select
              name="readingStatus"
              value={form.readingStatus}
              onChange={handleChange}
            >
              <option value="unread">Unread</option>
              <option value="reading">Currently Reading</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isEditMode ? 'Update Book' : 'Add Book'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/books')}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddEditBook;