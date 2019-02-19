import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

class AuthorDetail extends Component {
  state = {
    title: '',
    author: '',
    authorsBook: [],
  };

  componentDidMount() {
    fetch(`/catalog${this.props.location.pathname}`)
      .then(res => res.json())
      .then(data => this.setState({
        title: data.title,
        author: data.author,
        authorsBook: data.authorsBook,
      }));
  }

  render() {
    const { title, author, authorsBook } = this.state;
    return (
      <div>
        <h1>Author: {author.name}</h1>
        <p>{author.lifespan}</p>

        <div style={{ marginLeft: '20px', marginTop: '20px' }}>
          <h4>Books</h4>
          <dl>
            {authorsBook.length > 0 ? (
              authorsBook.map(book => (
                <Fragment key={book._id}>
                  <dt>
                    <Link to={book.url}>{book.title}</Link>
                  </dt>
                  <dd>{book.summary}</dd>
                </Fragment>
              ))
            ) : (
              <p>This author has no books in our library</p>
            )}
          </dl>
        </div>
      </div>
    );
  }
}

export default AuthorDetail;
