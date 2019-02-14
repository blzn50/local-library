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
    console.log('error: ', error);
    console.log(data);
    return (
      <div>
        <h1>Welcome to {title}!!!</h1>
        <h3>A greate place to harness knowledge.</h3>
        {error ? (
          <h4>Error on fetching data</h4>
        ) : (
          <Fragment>
            <p>The library has following record counts:</p>
            <ul>
              <li>
                <strong>Books: </strong>
                {data.bookCount}
              </li>
              <li>
                <strong>Copies: </strong>
                {data.bookInstanceCount}
              </li>
              <li>
                <strong>Available: </strong>
                {data.bookInstanceAvailableCount}
              </li>
              <li>
                <strong>Authors: </strong>
                {data.authorCount}
              </li>
              <li>
                <strong>Genres: </strong>
                {data.genreCount}
              </li>
            </ul>
          </Fragment>
        )}
      </div>
    );
  }
}

export default Home;
