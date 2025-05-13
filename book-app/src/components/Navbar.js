import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <div className="nav-brand">
        <Link to="/">📚 BookShelf</Link>
      </div>
      
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
          Dashboard
        </NavLink>
        <NavLink to="/books" className={({ isActive }) => isActive ? 'active' : ''}>
          Book Collection
        </NavLink>
        <NavLink to="/reading-list" className={({ isActive }) => isActive ? 'active' : ''}>
          Reading List
        </NavLink>
        <NavLink to="/add-book" className={({ isActive }) => isActive ? 'active' : ''}>
          Add Book
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;