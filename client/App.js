import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Books from './components/Books';
import BookDetail from './components/BookDetail';
import Authors from './components/Authors';
import Genres from './components/Genres';
import BookInstances from './components/BookInstances';
import BookCreate from './components/BookCreate';
import GenreCreate from './components/GenreCreate';
import AuthorCreate from './components/AuthorCreate';
import BookInstanceCreate from './components/BookInstanceCreate';
import GenreDetail from './components/GenreDetail';
import AuthorDetail from './components/AuthorDetail';

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
                <Route path="/book/:id" component={BookDetail} />
                <Route path="/authors" component={Authors} />
                <Route path="/author/:id" component={AuthorDetail} />
                <Route path="/genres" component={Genres} />
                <Route path="/genre/:id" component={GenreDetail} />
                <Route path="/bookinstances" component={BookInstances} />
                {/* <Route path="/book/create" component={BookCreate} />
                <Route path="/author/create" component={AuthorCreate} />
                <Route path="/genre/create" component={GenreCreate} />
                <Route path="/bookinstance/create" component={BookInstanceCreate} /> */}
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
