import React, { Component } from 'react';
import { Alert } from 'reactstrap';

class BookInstanceCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookList: [],
      errors: [],
      isOpen: true,
    };
  }

  componentDidMount() {
    fetch('/catalog/bookinstance/create')
      .then(res => res.json())
      .then(data => this.setState({ bookList: data.bookList }));
  }

  handleSubmit = (e) => {
    e.preventDefault();
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
    const { bookList, errors, isOpen } = this.state;
    return (
      <div>
        <h1>Book Instance Create</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="book">Book:</label>
            <select
              className="form-control"
              required
              name="book"
              id="book"
              defaultValue="Select book"
            >
              {bookList.map(book => (
                <option key={book._id} value={book._id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>
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

export default BookInstanceCreate;
