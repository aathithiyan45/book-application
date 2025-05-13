import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function QuickActions() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className="quick-actions">
      <div 
        className="quick-action-btn add" 
        onClick={() => navigate('/books/add')}
      >
        <i className="fas fa-plus"></i>
        <div className="quick-action-tooltip">Add New Book</div>
      </div>
      
      {location.pathname.includes('/books') && !location.pathname.includes('/add') && (
        <div 
          className="quick-action-btn edit" 
          onClick={() => {
            // This would need to be connected to your book selection logic
            const selectedBookId = '123'; // Replace with actual selected book ID
            navigate(`/books/edit/${selectedBookId}`);
          }}
        >
          <i className="fas fa-edit"></i>
          <div className="quick-action-tooltip">Edit Selected Book</div>
        </div>
      )}
    </div>
  );
}

export default QuickActions;