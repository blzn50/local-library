import React, { Component, Fragment } from 'react';
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
              {data.length > 0 ? (
                data.map(genre => (
                  <li key={genre._id}>
                    <Link to={genre.url}>{genre.name}</Link>
                  </li>
                ))
              ) : (
                <li>There are no genres listed yet.</li>
              )}
            </ul>
          </Fragment>
        )}
      </div>
    );
  }
}

export default Genres;
