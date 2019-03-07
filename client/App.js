import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
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

class App extends Component {
  state = { data: null };

  componentDidMount() {
    fetch('/api')
      .then(res => res.json())
      .then(data => this.setState({ data: data.data }));
  }

  render() {
    return (
      <div className="container-fluid">
        <BrowserRouter>
          <div className="row">
            <div className="col-sm-2">
              <Sidebar />
            </div>
            <div className="col-sm-10">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/books" component={Books} />
                <Route path="/book/book-form" component={BookCreate} />
                <Route path="/book/:id" component={BookDetail} />
                <Route path="/authors" component={Authors} />
                <Route path="/author/author-form" component={AuthorCreate} />
                <Route path="/author/:id" component={AuthorDetail} />
                <Route path="/genres" component={Genres} />
                <Route path="/genre/genre-form" component={GenreCreate} />
                <Route path="/genre/:id" component={GenreDetail} />
                <Route path="/bookinstances" component={BookInstances} />
                <Route path="/bookinstance/bookinstance-form" component={BookInstanceCreate} />
                <Route path="/bookinstance/:id" component={BookInstanceDetail} />
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
