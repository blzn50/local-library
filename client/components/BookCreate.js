import React, { Component } from 'react';
import { Alert } from 'reactstrap';

class BookCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: [],
      genres: [],
    };
  }

  componentDidMount() {
    fetch('/catalog/book/create')
      .then(res => res.json())
      .then(data => this.setState({
        authors: data.authors,
        genres: data.genres,
      }));
  }

  render() {
    const { authors, genres } = this.state;
    return (
      <div>
        <h1>Book Create</h1>

        <form>
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
        </form>
      </div>
    );
  }
}

export default BookCreate;
