import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Alert, CustomInput } from 'reactstrap';

class BookUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: [],
      genres: [],
      checked: [],
      errors: [],
      isOpen: true,
    };
  }

  componentDidMount() {
    fetch(`/catalog${this.props.location.pathname}`)
      .then(res => res.json())
      .then(data => this.setState({
        authors: data.authors,
        genres: data.genres,
      }));
  }

  render() {
    return (
      <div>
        <h1>Book Update</h1>

        <form onSubmit={this.handleSubmit} style={{ maxWidth: '600px' }}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              placeholder="Title of book"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="author">Author:</label>
            <select className="form-control" name="author" id="author" defaultValue="Select author">
              {authors.map(author => (
                <option key={author._id} value={author._id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="summary">Summary:</label>
            <input
              type="textarea"
              className="form-control"
              id="summary"
              name="summary"
              placeholder="Summary"
            />
          </div>
          <div className="form-group">
            <label htmlFor="isbn">ISBN:</label>
            <input
              type="text"
              className="form-control"
              id="isbn"
              name="isbn"
              placeholder="ISBN13"
            />
          </div>
          <div className="form-group">
            <label htmlFor="genre">Genre:</label>
            <div>
              {genres.map(genre => (
                <CustomInput
                  key={genre._id}
                  inline
                  readOnly
                  type="checkbox"
                  id={genre._id}
                  name="genre"
                  value={genre._id}
                  label={genre.name}
                  // checked={checked}
                  onClick={this.handleCheck}
                />
              ))}
            </div>
          </div>
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
        <ul className="list-group" style={{ position: 'relative' }}>
          {errors.length > 0
            && errors.map(err => (
              <Alert
                isOpen={isOpen}
                toggle={this.handleDismiss}
                color="danger"
                className=""
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

export default BookUpdate;
