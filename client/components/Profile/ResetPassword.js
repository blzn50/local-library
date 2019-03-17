import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {
  Form, FormGroup, Label, Input, Button, Spinner,
} from 'reactstrap';

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      visiblePass: false,
      updated: false,
      isLoading: true,
      error: false,
    };
  }

  componentDidMount() {
    const { token } = this.props.match.params;
    console.log('token: ', token);
    fetch(`/users/resetpassword/${token}`)
      .then(res => res.json())
      .then((data) => {
        if (data.errors) {
          this.setState({ updated: false, isLoading: false, error: true });
        } else {
          this.setState({
            email: data.email,
            updated: false,
            isLoading: false,
            error: false,
          });
        }
      })
      .catch(err => console.log(err));
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  toggleIcon = () => {
    this.setState(prevState => ({
      visiblePass: !prevState.visiblePass,
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    fetch('/users/resetpasswordviaemail', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then(res => res.json())
      .then((data) => {
        if (data.message) {
          this.setState({
            updated: true,
            error: false,
          });
        } else {
          this.setState({
            updated: false,
            error: true,
          });
        }
      })
      .catch(err => console.log(err));
  };

  render() {
    const {
      password, visiblePass, updated, isLoading, error,
    } = this.state;
    if (error) {
      return (
        <div className="mt-4">
          <h3 className="text-center">Reset Password</h3>
          <div style={{ margin: '1em', fontSize: '1.2em' }}>
            <h4>Problem resetting the password. Please resend another reset link.</h4>
            <Link to="/" className="text-success">
              Go Home
            </Link>{' '}
            <Link to="/forgotpassword" className="text-primary d-inline-block">
              Forgot Password?
            </Link>
          </div>
        </div>
      );
    }
    if (isLoading) {
      return (
        <div>
          <h3 className="text-center mt-4">Reset Password</h3>
          <div style={{ margin: '50px auto', width: '100px' }}>
            <Spinner style={{ width: '40px', height: '40px' }} color="secondary" />
          </div>
        </div>
      );
    }
    return (
      <div className="form-container">
        {updated ? (
          <div style={{ padding: '1.5em' }}>
            <p>Your password has been updated successfully. Please try logging in again.</p>
            <Link to="/login" className="text-success">
              Login
            </Link>{' '}
            <Link to="/" className="text-primary d-inline-block">
              Go Home
            </Link>
          </div>
        ) : (
          <Form className="signUp" onSubmit={this.handleSubmit}>
            <h3 className="text-center">Reset Password</h3>
            <FormGroup>
              <Label for="password">Please input new password</Label>
              <Input
                name="password"
                type={visiblePass ? 'password' : 'text'}
                id="password"
                placeholder="Enter your new password"
                value={password}
                onChange={this.handleChange}
              />
              <FontAwesomeIcon
                className="eye-icon"
                onClick={this.toggleIcon}
                icon={visiblePass ? faEye : faEyeSlash}
              />{' '}
            </FormGroup>
            <Button color="success">Update Password</Button>
          </Form>
        )}
      </div>
    );
  }
}

export default ResetPassword;
