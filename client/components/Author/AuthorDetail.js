import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner,
} from 'reactstrap';

class AuthorDetail extends Component {
  state = {
    author: '',
    authorsBook: [],
    modalData: [],
    modal: false,
  };

  componentDidMount() {
    fetch(`/catalog${this.props.location.pathname}`)
      .then(res => res.json())
      .then(data => this.setState({
        author: data.author,
        authorsBook: data.authorsBook,
      }));
  }

  handleDelete = () => {
    const { author } = this.state;
    fetch(`/catalog/author/${author._id}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authorid: author._id,
      }),
    })
      .then(res => res.json())
      .then((data) => {
        if (data.authorsBooks) {
          this.setState({
            modalData: data.authorsBooks,
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
    const { modal, authorsBook, author } = this.state;
    return (
      <Fragment>
        <Modal size="lg" isOpen={modal} toggle={this.toggleModal}>
          <ModalHeader tag="h3" toggle={this.toggleModal}>
            {author.name}
          </ModalHeader>
          <ModalBody>
            {authorsBook.length > 0 ? (
              <Fragment>
                <p>
                  <strong>
                    Delete the following books before attempting to delete this author!
                  </strong>
                </p>
                <dl>
                  {authorsBook.map(book => (
                    <Fragment key={book._id}>
                      <dt>
                        <Link to={book.url}>{book.title}</Link>
                      </dt>
                    </Fragment>
                  ))}
                </dl>
              </Fragment>
            ) : (
              <p>Do you really want to delete this author?</p>
            )}
          </ModalBody>
          <ModalFooter>
            {authorsBook.length === 0 ? (
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
    const { author, authorsBook } = this.state;
    return (
      <div>
        {author === '' ? (
          <div style={{ margin: '100px auto', width: '200px' }}>
            <Spinner style={{ width: '40px', height: '40px' }} color="secondary" />
          </div>
        ) : (
          <Fragment>
            <h1>Author: {author.name}</h1>
            <p>{author.lifespan}</p>

            <div style={{ marginLeft: '20px', marginTop: '20px' }}>
              <h4>Books</h4>
              <dl>
                {authorsBook.length > 0 ? (
                  authorsBook.map(book => (
                    <Fragment key={book._id}>
                      <dt>
                        <Link to={book.url}>{book.title}</Link>
                      </dt>
                      <dd>{book.summary}</dd>
                    </Fragment>
                  ))
                ) : (
                  <p>This author has no books in our library</p>
                )}
              </dl>
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
          </Fragment>
        )}
      </div>
    );
  }
}

export default AuthorDetail;
