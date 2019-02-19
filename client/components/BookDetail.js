import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

class BookDetail extends Component {
  state = {
    title: '',
    book: '',
    bookInstance: [],
  };

  componentDidMount() {
    fetch(`/catalog${this.props.location.pathname}`)
      .then(res => res.json())
      .then(data => this.setState({
        title: data.title,
        book: data.book,
        bookInstance: data.bookInstance,
      }));
  }

  render() {
    const { title, book, bookInstance } = this.state;
    return (
      <div>
        <h1>
          {title}: {book.title}
        </h1>
        {book !== '' && (
          <Fragment>
            <p>
              <strong>Author:</strong> <Link to={book.author.url}>{book.author.name}</Link>
            </p>
            <p>
              <strong>Summary:</strong> {book.summary}
            </p>
            <p>
              <strong>ISBN:</strong> {book.isbn}
            </p>
            <p>
              <strong>Genre: </strong>
              {book.genre.map((data, i) => (
                <Fragment key={data._id}>
                  <Link key={data._id} to={data.url}>
                    {data.name}
                  </Link>
                  {i < book.genre.length - 1 && ', '}
                </Fragment>
              ))}
            </p>
          </Fragment>
        )}

        <div style={{ marginLeft: '20px', marginTop: '20px' }}>
          <h4>Copies</h4>
          {bookInstance.length > 0 ? (
            bookInstance.map(bookInst => (
              <Fragment key={bookInst._id}>
                <hr />
                {(() => {
                  switch (bookInst.status) {
                    case 'Available':
                      return <p className="text-success">{bookInst.status}</p>;
                    case 'Maintenance':
                      return <p className="text-danger">{bookInst.status}</p>;
                    default:
                      return <p className="text-warning">{bookInst.status}</p>;
                  }
                })()}
                <p>
                  <strong>Imprint:</strong> {bookInst.imprint}
                </p>
                {bookInst.status !== 'Available' && (
                  <p>
                    <strong>Due back:</strong> {bookInst.dueBackFormatted}
                  </p>
                )}
                <p>
                  <strong>Id:</strong> <Link to={bookInst.url}> {bookInst._id}</Link>
                </p>
              </Fragment>
            ))
          ) : (
            <p>There are no copies of this book in the library.</p>
          )}
        </div>
      </div>
    );
  }
}

export default BookDetail;
