import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import moment from 'moment';

class BookInstanceCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookList: [],
      book: '',
      imprint: '',
      dueBack: '',
      status: '',
      errors: [],
    };
  }

  componentDidMount() {
    const { bookInstance } = this.props.location;
    if (bookInstance) {
      this.setState({
        book: bookInstance.book._id,
        imprint: bookInstance.imprint,
        dueBack: bookInstance.dueBack,
        status: bookInstance.status,
      });
    }
    fetch('/catalog/bookinstance/create')
      .then(res => res.json())
      .then((data) => {
        this.setState({ bookList: data.bookList });
      });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { bookInstance } = this.props.location;
    const {
      book, imprint, dueBack, status,
    } = this.state;
    if (bookInstance) {
      fetch(`/catalog/bookinstance/${bookInstance._id}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book,
          imprint,
          dueBack,
          status,
        }),
      })
        .then(res => res.json())
        .then((data) => {
          if (data.errors) {
            this.setState({ errors: data.errors });
          }
          if (data.url && window) {
            window.location.href = data.url;
          }
        });
    } else {
      fetch('/catalog/bookinstance/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book: e.target[0].value,
          imprint: e.target[1].value,
          dueBack: e.target[2].value,
          status: e.target[3].value,
        }),
      })
        .then(res => res.json())
        .then((data) => {
          if (data.errors) {
            this.setState({ errors: data.errors });
          }
          if (data.url && window) {
            window.location.href = data.url;
          }
        });
    }
  };

  render() {
    const {
      bookList, errors, book, imprint, dueBack, status,
    } = this.state;

    return (
      <div>
        <h1>Book Instance Form</h1>
        <form onSubmit={this.handleSubmit} style={{ maxWidth: '600px' }}>
          <div className="form-group">
            <label htmlFor="book">Book:</label>
            <select
              className="form-control"
              required
              name="book"
              id="book"
              value={book}
              onChange={this.handleChange}
            >
              {bookList.map(book => (
                <option key={book._id} value={book._id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="imprint">Imprint:</label>
            <input
              type="text"
              id="imprint"
              name="imprint"
              className="form-control"
              placeholder="Publisher and date information"
              required
              value={imprint}
              onChange={this.handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueBack">Date when book available: </label>
            <input
              className="form-control"
              type="date"
              id="dueBack"
              name="dueBack"
              placeholder="dd/mm/yyyy"
              value={moment(dueBack).format('YYYY-MM-DD')}
              onChange={this.handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select
              className="form-control"
              name="status"
              id="status"
              value={status}
              onChange={this.handleChange}
            >
              <option value="Maintenance">Maintenance</option>
              <option value="Available">Available</option>
              <option value="Loaned">Loaned</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>

          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
        <ul className="list-group" style={{ position: 'relative' }}>
          {errors.length > 0
            && errors.map(err => (
              <Alert color="danger" className="" key={err.msg}>
                {err.msg}
              </Alert>
            ))}
        </ul>
      </div>
    );
  }
}

export default BookInstanceCreate;
