import React from 'react';
import { NavLink } from 'react-router-dom';

function MobileNav() {
  return (
    <div className="mobile-nav">
      <NavLink to="/" className={({isActive}) => 
        isActive ? "mobile-nav-item active" : "mobile-nav-item"}>
        <i className="fas fa-home"></i>
        <span>Home</span>
      </NavLink>
      <NavLink to="/books" className={({isActive}) => 
        isActive ? "mobile-nav-item active" : "mobile-nav-item"}>
        <i className="fas fa-book"></i>
        <span>Library</span>
      </NavLink>
      <NavLink to="/books/add" className={({isActive}) => 
        isActive ? "mobile-nav-item active" : "mobile-nav-item"}>
        <i className="fas fa-plus-circle"></i>
        <span>Add</span>
      </NavLink>
    </div>
  );
}

export default MobileNav;