import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

class BookInstanceDetail extends Component {
  state = {
    bookInstance: '',
    modal: false,
  };

  componentDidMount() {
    fetch(`/catalog${this.props.location.pathname}`)
      .then(res => res.json())
      .then(data => this.setState({
        bookInstance: data.bookInstance,
      }));
  }

  handleDelete = () => {
    const { bookInstance } = this.state;
    fetch(`/catalog/bookInstance/${bookInstance._id}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookinstanceid: bookInstance._id,
      }),
    })
      .then(res => res.json())
      .then((data) => {
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
    const { modal, bookInstance } = this.state;
    return (
      <Fragment>
        <Modal isOpen={modal} toggle={this.toggleModal}>
          <ModalHeader tag="h3" toggle={this.toggleModal}>
            {bookInstance !== '' && bookInstance.book.title}
          </ModalHeader>
          <ModalBody>
            <p>Do you really want to delete this book?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.handleDelete}>
              Delete
            </Button>

            <Button color="secondary" onClick={this.toggleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  };

  render() {
    const { bookInstance } = this.state;
    return (
      <div>
        {bookInstance === '' ? (
          <div className="text-center">
            <div
              style={{ width: '3em', height: '3em' }}
              className="mt-5 spinner-border text-secondary"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <Fragment>
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

            <div className="float-right">
              <Link
                to={{
                  pathname: '/bookinstance/bookinstance-form',
                  bookInstance,
                }}
                className="btn btn-success mr-3"
              >
                Edit
              </Link>
              <button onClick={this.toggleModal} type="button" className="btn btn-danger">
                Delete
              </button>
            </div>

            {this.renderModal()}
          </Fragment>
        )}
      </div>
    );
  }
}

export default BookInstanceDetail;
