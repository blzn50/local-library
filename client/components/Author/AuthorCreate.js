import React, { Component } from 'react';
import moment from 'moment';
import { Alert } from 'reactstrap';
import '../Genre/genreCreate.scss';

class AuthorCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: [],
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      dateOfDeath: '',
      isOpen: true,
    };
  }

  componentDidMount() {
    const { author } = this.props.location;

    if (author) {
      this.setState({
        firstName: author.firstName,
        lastName: author.lastName,
        dateOfBirth: author.dateOfBirth,
        dateOfDeath: author.dateOfDeath,
      });
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { author } = this.props.location;

    // console.log(e.target[0].value);
    const firstName = e.target[0].value;
    const lastName = e.target[1].value;
    const dateOfBirth = e.target[2].value;
    const dateOfDeath = e.target[3].value;

    if (author) {
      fetch(`/catalog/author/${author._id}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          dateOfBirth,
          dateOfDeath,
        }),
      })
        .then(res => res.json())
        .then((data) => {
          if (data.errors) {
            this.setState({ error: data.errors });
          }
          if (data.url && window) {
            window.location.href = data.url;
          }
        });
    } else {
      fetch('/catalog/author/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          dateOfBirth,
          dateOfDeath,
        }),
      })
        .then(res => res.json())
        .then((data) => {
          if (data.errors) {
            this.setState({ error: data.errors });
          }
          if (data.url && window) {
            window.location.href = data.url;
          }
        });
    }
  };

  handleDismiss = () => {
    this.setState({ isOpen: false, error: [] }, () => {
      this.resetState();
    });
  };

  resetState = () => {
    this.setState({ isOpen: true });
  };

  render() {
    const {
      isOpen, error, firstName, lastName, dateOfBirth, dateOfDeath,
    } = this.state;
    // console.log('dateOfBirth: ', dateOfBirth);
    return (
      <div>
        <h1>Author Form</h1>

        <form style={{ maxWidth: '500px' }} onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="form-control"
              placeholder="First Name"
              required
              value={firstName}
              onChange={this.handleChange}
            />
            <label htmlFor="lastName"> Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="form-control"
              placeholder="Last Name"
              required
              value={lastName}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              className="form-control"
              placeholder="dd/mm/yyyy"
              value={moment(dateOfBirth).format('YYYY-MM-DD') || ''}
              onChange={this.handleChange}
            />
            <label htmlFor="dateOfDeath">Date of Death</label>
            <input
              type="date"
              id="dateOfDeath"
              name="dateOfDeath"
              className="form-control"
              placeholder="dd/mm/yyyy"
              value={moment(dateOfDeath).format('YYYY-MM-DD') || ''}
              onChange={this.handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        <ul className="list-group" style={{ position: 'relative' }}>
          {error.length > 0
            && error.map(err => (
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

export default AuthorCreate;
