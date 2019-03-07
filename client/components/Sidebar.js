import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.scss';

const Sidebar = () => (
  <aside>
    <ul className="sidebar-nav">
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/books">All Books</Link>
      </li>
      <li>
        <Link to="/authors">All Authors</Link>
      </li>
      <li>
        <Link to="/genres">All Genres</Link>
      </li>
      <li>
        <Link to="/bookinstances">All Book Instances</Link>
      </li>
      <hr />
      <li>
        <Link to="/book/book-form">Create new book</Link>
      </li>
      <li>
        <Link to="/author/author-form">Create new author</Link>
      </li>
      <li>
        <Link to="/genre/genre-form">Create new genre</Link>
      </li>
      <li>
        <Link to="/bookinstance/bookinstance-form">Create new book instance (copy)</Link>
      </li>
    </ul>
  </aside>
);

export default Sidebar;
