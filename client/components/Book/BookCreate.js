import React, { Component } from 'react';
import { Alert, CustomInput } from 'reactstrap';

class BookCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: [],
      genres: [],
      title: '',
      author: '',
      summary: '',
      isbn: '',
      checked: [],
      errors: [],
      isOpen: true,
    };
  }

  componentDidMount() {
    const { book } = this.props.location;
    // console.log('book: ', book);

    if (book) {
      this.setState({
        title: book.title,
        author: book.author,
        summary: book.summary,
        isbn: book.isbn,
        checked: book.genre.map(g => g.id),
      });
    }
    fetch('/catalog/book/create')
      .then(res => res.json())
      .then(data => this.setState({
        authors: data.authors,
        genres: data.genres,
      }));
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleCheck = (e) => {
    const { checked } = this.state;
    const fromChecked = e.target.value;
    const tempArr = checked.slice();

    if (tempArr.length < 1) {
      tempArr.push(e.target.value);
    } else {
      const indexOfVal = tempArr.indexOf(fromChecked);
      if (indexOfVal !== -1) {
        tempArr.splice(indexOfVal, 1);
      } else {
        tempArr.push(fromChecked);
      }
    }
    this.setState({
      checked: tempArr,
    });
  };

  handleSubmit = (e) => {
    const {
      checked, title, author, summary, isbn,
    } = this.state;
    const { book } = this.props.location;
    e.preventDefault();
    if (book) {
      fetch(`/catalog/book/${book._id}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          author,
          summary,
          isbn,
          genre: checked,
        }),
      })
        .then(res => res.json())
        .then((data) => {
          console.log('updating book: ', data);
          if (data.errors) {
            this.setState({ errors: data.errors });
          }
          if (data.url && window) {
            window.location.href = data.url;
          }
        });
    } else {
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
          genre: checked,
        }),
      })
        .then(res => res.json())
        .then((data) => {
          console.log('creating book: ', data);
          if (data.errors) {
            this.setState({ errors: data.errors });
          }
          if (data.url && window) {
            window.location.href = data.url;
          }
        });
    }
  };

  handleDismiss = () => {
    this.setState({ isOpen: false, errors: [] }, () => {
      this.resetState();
    });
  };

  resetState = () => {
    this.setState({ isOpen: true });
  };

  render() {
    const {
      authors, genres, errors, isOpen, title, author, summary, isbn, checked,
    } = this.state;
    const { book } = this.props.location;

    return (
      <div>
        <h1>Book Form</h1>

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
              value={title}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="author">Author:</label>
            <select
              className="form-control"
              name="author"
              id="author"
              value={author._id}
              onChange={this.handleChange}
            >
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
              value={summary}
              onChange={this.handleChange}
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
              value={isbn}
              onChange={this.handleChange}
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
                  checked={checked.indexOf(genre._id) !== -1}
                  label={genre.name}
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

export default BookCreate;
