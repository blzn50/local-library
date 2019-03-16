import React, { Component } from 'react';
import {
  Form, FormGroup, Label, Input, Button, Alert,
} from 'reactstrap';
import './signup.scss';

class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      errors: [],
      message: '',
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    fetch('/users/forgotpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: e.target[0].value,
      }),
    })
      .then(res => res.json())
      .then((data) => {
        if (data.errors) {
          this.setState({
            errors: data.errors,
          });
        } else {
          this.setState({ message: data.message, errors: [] });
        }
      });
  };

  render() {
    const { errors, message } = this.state;
    return (
      <div className="form-container">
        <Form className="signUp" onSubmit={this.handleSubmit}>
          <h3>Reset Password</h3>
          <ul className="list-group errors" style={{ width: '100%' }}>
            {errors.length > 0
              && errors.map(err => (
                <Alert color="danger" key={err.msg}>
                  {err.msg}
                </Alert>
              ))}
            {message ? <Alert color="success">{message}</Alert> : ''}
          </ul>
          <FormGroup>
            <Label for="email">To reset your password, please provide us your email.</Label>
            <Input name="email" id="email" type="email" />
          </FormGroup>
          <Button className="px-4" color="primary">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default ForgotPassword;
