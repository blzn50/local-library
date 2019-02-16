import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Genres extends Component {
  state = {
    title: '',
    data: [],
  };

  componentDidMount() {
    fetch('/catalog/genres/')
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
          {data.length > 0 ? (
            data.map(genre => (
              <li>
                <Link to={genre.url}>{genre.name}</Link>
              </li>
            ))
          ) : (
            <li>There are no genres listed yet.</li>
          )}
        </ul>
      </div>
    );
  }
}

export default Genres;
