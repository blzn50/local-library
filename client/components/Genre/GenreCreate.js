import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { Alert } from 'reactstrap';
import './genreCreate.scss';

class GenreCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: [],
      genre: '',
      isOpen: true,
    };
    // this.genreRef = React.createRef();
  }

  componentDidMount() {
    const { genre } = this.props.location;
    if (genre) {
      this.setState({
        genre: genre.name,
      });
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // const d = this.genreRef.current.value;
    const { genre } = this.props.location;
    if (genre) {
      fetch(`/catalog/genre/${genre._id}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.state.genre,
        }),
      })
        .then(res => res.json())
        .then((data) => {
          if (data.errors) {
            this.setState({
              error: data.errors,
            });
          }
          if (data.url && window) {
            window.location.href = data.url;
          }
        });
    } else {
      fetch('/catalog/genre/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.state.genre,
        }),
      })
        .then(res => res.json())
        .then((data) => {
          if (data.errors) {
            this.setState({
              error: data.errors,
            });
          }
          if (data.url && window) {
            window.location.href = data.url;
          }
        });
    }
  };

  handleDismiss = () => {
    this.setState({ isOpen: false, error: [] }, () => {
      this.resetState();
    });
  };

  resetState = () => {
    this.setState({ isOpen: true });
  };

  render() {
    const { error, isOpen, genre } = this.state;
    return (
      <div>
        <h1>Genre Form</h1>
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
                required
                value={genre}
                onChange={this.handleChange}
              />
            </label>
          </div>
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
        <ul className="list-group" style={{ position: 'relative' }}>
          {error.length > 0
            && error.map(err => (
              <Alert
                isOpen={isOpen}
                toggle={this.handleDismiss}
                className="error-msg"
                color="danger"
                key={err.msg}
              >
                {err.msg}
              </Alert>
            ))}
        </ul>
      </div>
    );
  }
}

export default GenreCreate;
