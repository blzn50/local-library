import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

class GenreCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
    this.genreRef = React.createRef();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // console.log(e.target[0]);
    console.log(this.genreRef.current.value);
    const d = this.genreRef.current.value;
    // const b = e.target[0];

    fetch('/catalog/genre/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: d,
      }),
    })
      .then(res => res.json())
      .then(data => console.log(data));
  };

  render() {
    const { genreValue } = this.state;
    return (
      <div>
        <h1>Create Genre</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="genre">
              Genre:
              <input
                type="text"
                id="genre"
                name="genre"
                className="form-control"
                placeholder="Fantasy, Poetry etc."
                ref={this.genreRef}
              />
            </label>
          </div>
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default GenreCreate;
