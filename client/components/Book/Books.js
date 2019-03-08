import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

class Books extends Component {
  state = {
    title: '',
    data: [],
  };

  componentDidMount() {
    fetch('/catalog/books/')
      .then(res => res.json())
      .then(data => this.setState({
        title: data.title,
        data: data.data,
      }));
  }

  render() {
    const { title, data } = this.state;
    return (
      <div>
        {title === '' ? (
          <div className="text-center">
            <div
              style={{ width: '3em', height: '3em' }}
              className="mt-5 spinner-border text-secondary"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <Fragment>
            <h1>{title}</h1>
            <ul>
              {data.length >= 1 ? (
                data.map(book => (
                  <li key={book._id}>
                    <Link to={book.url}>{book.title}</Link> ({book.author.name})
                  </li>
                ))
              ) : (
                <li>There are no books.</li>
              )}
            </ul>
          </Fragment>
        )}
      </div>
    );
  }
}

export default Books;
