import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './sidebar.scss';

const Sidebar = ({ session }) => {
  // console.log(session);
  if (session) {
    return (
      <aside>
        <ul className="sidebar-nav">
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
  }
  return <div />;
};

Sidebar.propTypes = {
  session: PropTypes.bool.isRequired,
};

export default Sidebar;
