import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

class GenreDetail extends Component {
  state = {
    genre: '',
    genreBooks: [],
    modalData: [],
    modal: false,
  };

  componentDidMount() {
    fetch(`/catalog${this.props.location.pathname}`)
      .then(res => res.json())
      .then(data => this.setState({
        genre: data.genre,
        genreBooks: data.genreBooks,
      }));
  }

  handleDelete = () => {
    const { genre } = this.state;
    fetch(`/catalog/genre/${genre._id}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        genreid: genre._id,
      }),
    })
      .then(res => res.json())
      .then((data) => {
        if (data.bookInstance) {
          this.setState({
            modalData: data.genreBooks,
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
    const { modal, genre, genreBooks } = this.state;
    return (
      <Fragment>
        <Modal isOpen={modal} toggle={this.toggleModal}>
          <ModalHeader tag="h3" toggle={this.toggleModal}>
            {genre.name}
          </ModalHeader>
          <ModalBody>
            {genreBooks.length > 0 ? (
              <Fragment>
                <p>
                  <strong>
                    Delete the following book(s) before attempting to delete this genre!
                  </strong>
                </p>

                {genreBooks.map(genreBook => (
                  <Fragment key={genreBook._id}>
                    <dt>
                      <Link to={genreBook.url}>{genreBook.title}</Link>
                    </dt>
                  </Fragment>
                ))}
              </Fragment>
            ) : (
              <p>Do you really want to delete this book?</p>
            )}
          </ModalBody>
          <ModalFooter>
            {genreBooks.length === 0 ? (
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
    const {  genre, genreBooks } = this.state;
    return (
      <div>
        {genre === '' ? (
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
            <h1>Genre: {genre.name}</h1>
            <div style={{ marginLeft: '20px', marginTop: '20px' }}>
              <h4>Books</h4>
              <dl>
                {genreBooks.length > 0 ? (
                  genreBooks.map(genreBook => (
                    <Fragment key={genreBook._id}>
                      <dt>
                        <Link to={genreBook.url}>{genreBook.title}</Link>
                      </dt>
                      <dd>{genreBook.summary}</dd>
                    </Fragment>
                  ))
                ) : (
                  <p>This genre has no books</p>
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

export default GenreDetail;
