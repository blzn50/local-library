import React, { Component } from 'react';
import { Alert, CustomInput } from 'reactstrap';

class BookCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: [],
      genres: [],
      checked: [],
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

  handleCheck = (e) => {
    const tempArr = this.state.checked.slice();
    if (tempArr.length < 1) {
      tempArr.push(e.target.value);
    } else {
      for (const a in tempArr) {
        if (e.target.value !== a) {
          tempArr.push(a);
        } else {
          tempArr.pop(a);
        }
      }
    }
    this.setState({
      checked: tempArr,
    });
    console.log(this.state.checked);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    // console.log(e.target[0].value);
    // console.log(e.target[1].value);
    // console.log(e.target[2].value);
    // console.log(e.target[3].value);
    console.log(e.target);
    fetch('/catalog/book/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: e.target[0].value,
        author: e.target[1].value,
        summary: e.target[2].value,
        isbn: e.target[3].value,
        genre: [],
      }),
    });
  };

  render() {
    const { authors, genres, checked } = this.state;
    return (
      <div>
        <h1>Book Create</h1>

        <form onSubmit={this.handleSubmit}>
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
      </div>
    );
  }
}

export default BookCreate;
