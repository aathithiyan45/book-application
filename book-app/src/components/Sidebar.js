import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>📚 BookShelf</h2>
      </div>
      <div className="sidebar-nav">
        <NavLink to="/" className={({isActive}) => 
          isActive ? "sidebar-nav-item active" : "sidebar-nav-item"}>
          <i className="fas fa-home"></i>
          Dashboard
        </NavLink>
        <NavLink to="/books" className={({isActive}) => 
          isActive ? "sidebar-nav-item active" : "sidebar-nav-item"}>
          <i className="fas fa-book"></i>
          My Library
        </NavLink>
        <NavLink to="/books/add" className={({isActive}) => 
          isActive ? "sidebar-nav-item active" : "sidebar-nav-item"}>
          <i className="fas fa-plus-circle"></i>
          Add Book
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;