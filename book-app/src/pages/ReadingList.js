import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ReadingList({ books }) {
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Filter books by reading status
  const filteredBooks = books.filter(book => {
    if (statusFilter === 'all') return true;
    return book.readingStatus === statusFilter;
  });
  
  return (
    <div className="reading-list-page">
      <div className="page-header">
        <h1>Reading List</h1>
      </div>
      
      <div className="reading-filters">
        <div className="status-filter">
          <div 
            className={`status-option ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </div>
          <div 
            className={`status-option ${statusFilter === 'unread' ? 'active' : ''}`}
            onClick={() => setStatusFilter('unread')}
          >
            Unread
          </div>
          <div 
            className={`status-option ${statusFilter === 'reading' ? 'active' : ''}`}
            onClick={() => setStatusFilter('reading')}
          >
            Reading
          </div>
          <div 
            className={`status-option ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completed
          </div>
        </div>
      </div>
      
      {filteredBooks.length === 0 ? (
        <div className="no-books">
          <p>No books found with the selected status.</p>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map(book => (
            <div key={book._id} className="book-card">
              {book.coverUrl && (
                <div className="book-cover">
                  <img src={book.coverUrl} alt={`Cover of ${book.title}`} />
                </div>
              )}
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              {book.genre && <span className="book-genre">{book.genre}</span>}
              <p className="reading-status">Status: {book.readingStatus}</p>
              <div className="book-actions">
                <Link to={`/books/${book._id}`} className="btn btn-primary">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReadingList;