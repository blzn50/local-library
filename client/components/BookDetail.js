import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

class BookDetail extends Component {
  state = {
    title: '',
    book: '',
    bookInstance: [],
    modalData: [],
    modal: false,
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

  handleDelete = () => {
    const { book } = this.state;
    fetch(`/catalog/book/${book._id}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookid: book._id,
      }),
    })
      .then(res => res.json())
      .then((data) => {
        if (data.bookInstance) {
          this.setState({
            modalData: data.bookInstance,
          });
        }
        if (data.url && window) {
          window.location.href = data.url;
        }
      });
  };

  toggleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  renderModal = () => {
    const { modal, bookInstance, book } = this.state;
    return (
      <Fragment>
        <Modal size="lg" isOpen={modal} toggle={this.toggleModal}>
          <ModalHeader tag="h3" toggle={this.toggleModal}>
            {book.title}
          </ModalHeader>
          <ModalBody>
            {bookInstance.length > 0 ? (
              <Fragment>
                <p>
                  <strong>
                    Delete the following book instance(s) before attempting to delete this book!
                  </strong>
                </p>

                {bookInstance.map(bookInst => (
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
                ))}
              </Fragment>
            ) : (
              <p>Do you really want to delete this book?</p>
            )}
          </ModalBody>
          <ModalFooter>
            {bookInstance.length === 0 ? (
              <Button color="danger" onClick={this.handleDelete}>
                Delete
              </Button>
            ) : (
              ''
            )}{' '}
            <Button color="secondary" onClick={this.toggleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  };

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

        <div className="float-right">
          <button onClick={this.toggleModal} type="button" className="btn btn-success mr-3">
            Edit
          </button>
          <button onClick={this.toggleModal} type="button" className="btn btn-danger">
            Delete
          </button>
        </div>

        {this.renderModal()}
      </div>
    );
  }
}

export default BookDetail;
