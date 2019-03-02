import React, { Component } from 'react';
import { Alert } from 'reactstrap';

class BookInstanceCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookList: [],
      errors: [],
    };
  }

  componentDidMount() {
    fetch('/catalog/bookinstance/create')
      .then(res => res.json())
      .then(data => this.setState({ bookList: data.bookList }));
  }

  handleSubmit = (e) => {
    e.preventDefault();
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
  };

  render() {
    const { bookList, errors } = this.state;
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

          <div className="form-group">
            <label htmlFor="imprint">Imprint:</label>
            <input
              type="text"
              id="imprint"
              name="imprint"
              className="form-control"
              placeholder="Publisher and date information"
              required
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select className="form-control" name="status" id="status" defaultValue="Select status">
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
