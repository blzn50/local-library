import React, { Component, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {
  Form, FormGroup, Label, Input, Button, Alert,
} from 'reactstrap';
import './signup.scss';

class Signup extends Component {
  state = {
    visiblePass: true,
    errors: [],
  };

  handleSubmit = (e) => {
    e.preventDefault();
    fetch('/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: e.target[0].value,
        email: e.target[1].value,
        password: e.target[2].value,
      }),
    })
      .then(res => res.json())
      .then((data) => {
        console.log(data.errors);
        if (data.errors) {
          this.setState({ errors: data.errors });
        }
        if (data.url && window) {
          this.setState({});
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
            <h3>
              Create an Account
              {/* <span className="miniTitle">It's Free!</span> */}
            </h3>
            <hr />
            <FormGroup>
              <Label for="fullName">Full name</Label>
              <Input name="fullName" type="text" id="fullName" placeholder="Enter your full name" />
            </FormGroup>
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
            <div>
              <Button className="px-4" color="success">
                Sign Up
              </Button>
            </div>
          </Form>
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
export default Signup;
