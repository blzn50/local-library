import React, { Component, Fragment } from 'react';

class Home extends Component {
  state = {
    title: '',
    data: '',
    error: '',
  };

  componentDidMount() {
    fetch('/catalog/')
      .then(res => res.json())
      .then(data => this.setState({ title: data.title, data: data.data, error: data.error }));
  }

  render() {
    const { title, data, error } = this.state;

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
            <h1>Welcome to {title}!!!</h1>
            <h3>A greate place to harness knowledge.</h3>
            {error ? (
              <h4>Error on fetching data</h4>
            ) : (
              <Fragment>
                <p>The library has following record counts:</p>
                <ul className="list-group" style={{ maxWidth: '450px' }}>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Books: </strong>
                    <span className="badge badge-primary badge-pill">{data.bookCount}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Copies: </strong>
                    <span className="badge badge-primary badge-pill">{data.bookInstanceCount}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Available: </strong>
                    <span className="badge badge-primary badge-pill">
                      {data.bookInstanceAvailableCount}
                    </span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Authors: </strong>
                    <span className="badge badge-primary badge-pill">{data.authorCount}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Genres: </strong>
                    <span className="badge badge-primary badge-pill">{data.genreCount}</span>
                  </li>
                </ul>
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    );
  }
}

export default Home;
