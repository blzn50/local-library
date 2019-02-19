import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

class BookInstanceDetail extends Component {
  state = {
    title: '',
    bookInstance: '',
  };

  componentDidMount() {
    fetch(`/catalog${this.props.location.pathname}`)
      .then(res => res.json())
      .then(data => this.setState({
        title: data.title,
        bookInstance: data.bookInstance,
      }));
  }

  render() {
    const { title, bookInstance } = this.state;
    return (
      <div>
        <h1>ID: {bookInstance._id}</h1>
        {bookInstance !== '' && (
          <Fragment>
            <p>
              <strong>Title: </strong>
              <Link to={bookInstance.book.url}>{bookInstance.book.title}</Link>
            </p>
          </Fragment>
        )}
        <p>
          <strong>Imprint: </strong>
          {bookInstance.imprint}
        </p>

        <p>
          <strong>Status: </strong>
          {(() => {
            switch (bookInstance.status) {
              case 'Available':
                return <span className="text-success">{bookInstance.status}</span>;
              case 'Maintenance':
                return <span className="text-danger">{bookInstance.status}</span>;
              default:
                return <span className="text-warning">{bookInstance.status}</span>;
            }
          })()}
        </p>
        {bookInstance.status !== 'Available' && (
          <p>
            <strong>Due back: </strong>
            {bookInstance.dueBackFormatted}
          </p>
        )}
      </div>
    );
  }
}

export default BookInstanceDetail;
