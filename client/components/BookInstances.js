import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class BookInstances extends Component {
  state = {
    title: '',
    data: [],
  };

  componentDidMount() {
    fetch('/catalog/bookinstances/')
      .then(res => res.json())
      .then((data) => {
        this.setState({
          title: data.title,
          data: data.data,
        });
      });
  }

  render() {
    const { title, data } = this.state;
    return (
      <div>
        <h1>{title}</h1>
        <ul>
          {data.length > 0 ? (
            data.map(bookInstance => (
              <li key={bookInstance._id}>
                <Link to={bookInstance.url}>{bookInstance.book.title}</Link> :{' '}
                {bookInstance.imprint} -
                {(() => {
                  switch (bookInstance.status) {
                    case 'Available':
                      return <span className="text-success"> {bookInstance.status}</span>;
                    case 'Maintenance':
                      return <span className="text-danger"> {bookInstance.status}</span>;
                    default:
                      return <span className="text-warning"> {bookInstance.status}</span>;
                  }
                })()}
                {bookInstance.status !== 'Available' && (
                  <span> (Due: {bookInstance.dueBackFormatted})</span>
                )}
                {/* {bookInstance.status === 'Available' && <span>{bookInstance.status}</span>}} */}
              </li>
            ))
          ) : (
            <li>There are no book copies available in this library.</li>
          )}
        </ul>
      </div>
    );
  }
}

export default BookInstances;
