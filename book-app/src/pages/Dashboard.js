import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard({ books }) {
  // Calculate statistics
  const totalBooks = books.length;
  const readingBooks = books.filter(book => book.readingStatus === 'reading').length;
  const completedBooks = books.filter(book => book.readingStatus === 'completed').length;
  const genres = [...new Set(books.filter(book => book.genre).map(book => book.genre))];
  
  // Get recently added books (last 3)
  const recentBooks = [...books].sort((a, b) => {
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  }).slice(0, 3);

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{totalBooks}</h3>
          <p>Total Books</p>
        </div>
        <div className="stat-card">
          <h3>{readingBooks}</h3>
          <p>Currently Reading</p>
        </div>
        <div className="stat-card">
          <h3>{completedBooks}</h3>
          <p>Completed Books</p>
        </div>
        <div className="stat-card">
          <h3>{genres.length}</h3>
          <p>Genres</p>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recently Added</h2>
            <Link to="/books" className="btn btn-secondary">View All</Link>
          </div>
          
          <div className="books-grid">
            {recentBooks.map(book => (
              <div key={book._id} className="book-card">
                {book.coverUrl && (
                  <div className="book-cover">
                    <img src={book.coverUrl} alt={`Cover of ${book.title}`} />
                  </div>
                )}
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <Link to={`/books/${book._id}`} className="btn btn-primary">View Details</Link>
              </div>
            ))}
            
            {recentBooks.length === 0 && (
              <p className="no-books">No books added yet. Add some books to your collection!</p>
            )}
          </div>
        </div>
        
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Currently Reading</h2>
            <Link to="/reading-list" className="btn btn-secondary">View All</Link>
          </div>
          
          <div className="books-grid">
            {books.filter(book => book.readingStatus === 'reading').slice(0, 3).map(book => (
              <div key={book._id} className="book-card">
                {book.coverUrl && (
                  <div className="book-cover">
                    <img src={book.coverUrl} alt={`Cover of ${book.title}`} />
                  </div>
                )}
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <Link to={`/books/${book._id}`} className="btn btn-primary">View Details</Link>
              </div>
            ))}
            
            {books.filter(book => book.readingStatus === 'reading').length === 0 && (
              <p className="no-books">No books currently being read.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;