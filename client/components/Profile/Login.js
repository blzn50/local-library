import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {
  Form, FormGroup, Label, Input, Button, Alert,
} from 'reactstrap';
import './signup.scss';

class Login extends Component {
  state = {
    visiblePass: true,
    errors: [],
  };

  handleSubmit = (e) => {
    e.preventDefault();
    fetch('/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: e.target[0].value,
        password: e.target[1].value,
      }),
    })
      .then(res => res.json())
      .then((data) => {
        if (data.errors) {
          this.setState({
            errors: data.errors,
          });
        }
        if (data.url && window) {
          window.location.href = data.url;
        }
      });
  };

  toggleIcon = () => {
    this.setState(prevState => ({
      visiblePass: !prevState.visiblePass,
    }));
  };

  render() {
    const { visiblePass, errors } = this.state;
    return (
      <Fragment>
        <div className="form-container">
          <Form className="signUp" onSubmit={this.handleSubmit}>
            <h3>Login</h3>
            <hr />
            <FormGroup>
              <Label for="email">Email</Label>
              <Input name="email" type="email" id="email" placeholder="Enter your email" />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                name="password"
                type={visiblePass ? 'password' : 'text'}
                id="password"
                placeholder="Enter your password"
              />
              <FontAwesomeIcon
                className="eye-icon"
                onClick={this.toggleIcon}
                icon={visiblePass ? faEye : faEyeSlash}
              />
            </FormGroup>
            <div className="forgotPassword">
              <Link to="/forgotpassword">Forgot your password?</Link>
            </div>
            <Button className="px-4" color="primary">
              Login
            </Button>
          </Form>
          <div className="form-buttom">
            Don't have an account? <Link to="/signup">Sign up now!</Link>
          </div>
        </div>
        <ul className="list-group errors">
          {errors.length > 0
            && errors.map(err => (
              <Alert color="danger" key={err.msg}>
                {err.msg}
              </Alert>
            ))}
        </ul>
      </Fragment>
    );
  }
}

export default Login;
