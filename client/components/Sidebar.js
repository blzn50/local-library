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
        <Link to="/book/create">Create new book</Link>
      </li>
      <li>
        <Link to="/author/create">Create new author</Link>
      </li>
      <li>
        <Link to="/genre/create">Create new genre</Link>
      </li>
      <li>
        <Link to="/bookinstance/create">Create new book instance</Link>
      </li>
    </ul>
  </aside>
);

export default Sidebar;
