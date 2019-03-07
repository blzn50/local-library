import React, { Component } from 'react';
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
      </div>
    );
  }
}

export default Books;
