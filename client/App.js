import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter, Switch, Route, Redirect, Link,
} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Authors from './components/Author/Authors';
import AuthorCreate from './components/Author/AuthorCreate';
import AuthorDetail from './components/Author/AuthorDetail';
import Books from './components/Book/Books';
import BookCreate from './components/Book/BookCreate';
import BookDetail from './components/Book/BookDetail';
import BookInstances from './components/BookInstance/BookInstances';
import BookInstanceCreate from './components/BookInstance/BookInstanceCreate';
import BookInstanceDetail from './components/BookInstance/BookInstanceDetail';
import Genres from './components/Genre/Genres';
import GenreCreate from './components/Genre/GenreCreate';
import GenreDetail from './components/Genre/GenreDetail';
import Signup from './components/Profile/Signup';
import Login from './components/Profile/Login';
import ForgotPassword from './components/Profile/ForgotPassword';
import ResetPassword from './components/Profile/ResetPassword';

const PrivateRoute = ({ component: Component, session, ...rest }) => (
  <Route
    {...rest}
    render={props => (session ? <Component {...props} /> : <Redirect to={{ pathname: '/login' }} />)
    }
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  session: PropTypes.bool.isRequired,
};

class App extends Component {
  state = {
    session: false,
    fakeData: '',
  };

  componentDidMount() {
    fetch('/users/detail')
      .then(res => res.json())
      .then((data) => {
        // console.log(data);
        this.setState({ fakeData: 'dummy data' });
        if (data.id) {
          this.setState({
            session: true,
          });
        }
      });
  }

  handlelogout = () => {
    fetch('/users/logout')
      .then(res => res.json())
      .then((data) => {
        this.setState({
          session: false,
        });
      });
  };

  render() {
    const { session, fakeData } = this.state;
    return (
      <div className="container-fluid">
        <BrowserRouter>
          <div className="row">
            <div className="col-sm-3">
              <li style={{ listStyleType: 'none' }}>
                <Link to="/">Home</Link>
              </li>
              <Sidebar session={session} />
              {/* eslint-disable-next-line no-nested-ternary */}
              {!session ? (
                fakeData !== '' ? (
                  <Fragment>
                    <Link to="/login">Login</Link>
                    <br />
                    <Link to="/signup">Signup</Link>
                  </Fragment>
                ) : (
                  ''
                )
              ) : (
                <button type="button" onClick={this.handlelogout} className="btn btn-danger">
                  Logout
                </button>
              )}
            </div>
            <div className="col-sm-9 mb-5" style={{ maxWidth: '1000px' }}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/forgotpassword" component={ForgotPassword} />
                <Route path="/resetpassword/:token" component={ResetPassword} />
                <PrivateRoute path="/books" session={session} component={Books} />
                {/* <Route path="/books" component={Books} /> */}
                <PrivateRoute path="/book/book-form" session={session} component={BookCreate} />
                <PrivateRoute path="/book/:id" session={session} component={BookDetail} />
                <PrivateRoute path="/authors" session={session} component={Authors} />
                <PrivateRoute
                  path="/author/author-form"
                  session={session}
                  component={AuthorCreate}
                />
                <PrivateRoute path="/author/:id" session={session} component={AuthorDetail} />
                <PrivateRoute path="/genres" session={session} component={Genres} />
                <PrivateRoute path="/genre/genre-form" session={session} component={GenreCreate} />
                <PrivateRoute path="/genre/:id" session={session} component={GenreDetail} />
                <PrivateRoute path="/bookinstances" session={session} component={BookInstances} />
                <PrivateRoute
                  path="/bookinstance/bookinstance-form"
                  session={session}
                  component={BookInstanceCreate}
                />
                <PrivateRoute
                  path="/bookinstance/:id"
                  session={session}
                  component={BookInstanceDetail}
                />
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
