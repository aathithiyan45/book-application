import React from 'react';
import { Link } from 'react-router-dom';

function BookList({ 
  books, 
  searchTerm, 
  setSearchTerm, 
  filterGenre, 
  setFilterGenre,
  genres,
  handleDelete,
  isLoading,
  pagination,
  goToNextPage,
  goToPrevPage,
  limit,
  setLimit 
}) {
  return (
    <div className="books-section">
      <div className="section-header">
        <h1>Book Collection</h1>
        <Link to="/add-book" className="btn btn-primary">Add New Book</Link>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="genre-filter">
          <select
            value={filterGenre}
            onChange={e => setFilterGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading books...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="no-books">
          <p>No books found. Add some books to your collection!</p>
        </div>
      ) : (
        <>
          <div className="books-grid">
            {books.map(book => (
              <div key={book._id} className="book-card">
                {book.coverUrl && (
                  <div className="book-cover">
                    <img src={book.coverUrl} alt={`Cover of ${book.title}`} />
                  </div>
                )}
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                {book.genre && <span className="book-genre">{book.genre}</span>}
                {book.publishedYear && <p className="book-year">Published: {book.publishedYear}</p>}
                <p className="reading-status">Status: {book.readingStatus}</p>
                <div className="book-actions">
                  <Link to={`/books/${book._id}`} className="btn btn-primary">View</Link>
                  <Link to={`/edit-book/${book._id}`} className="btn btn-edit">Edit</Link>
                  <button onClick={() => handleDelete(book._id)} className="btn btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <div className="page-info">
              <span>Showing {books.length} of {pagination.totalBooks} books</span>
              <select 
                value={limit} 
                onChange={e => setLimit(Number(e.target.value))}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
            <div className="page-buttons">
              <button 
                className="btn btn-secondary" 
                onClick={goToPrevPage} 
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </button>
              <span className="current-page">{pagination.currentPage}</span>
              <button 
                className="btn btn-secondary" 
                onClick={goToNextPage} 
                disabled={!pagination.hasNextPage}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BookList;