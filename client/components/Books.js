import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Books extends Component {
  state = {
    title: '',
    data: [],
    error: '',
  };

  componentDidMount() {
    fetch('/catalog/books/')
      .then(res => res.json())
      .then(data => this.setState({
        title: data.title,
        data: data.data,
        error: data.error,
      }));
  }

  render() {
    const { title, data, error } = this.state;
    return (
      <div>
        <h1>{title}</h1>
        {error ? (
          <p>Error on fetching data</p>
        ) : (
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
        )}
      </div>
    );
  }
}

export default Books;
