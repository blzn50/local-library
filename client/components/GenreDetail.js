import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

class GenreDetail extends Component {
  state = {
    title: '',
    genre: '',
    genreBooks: [],
  };

  componentDidMount() {
    fetch(`/catalog${this.props.location.pathname}`)
      .then(res => res.json())
      .then(data => this.setState({
        title: data.title,
        genre: data.genre,
        genreBooks: data.genreBooks,
      }));
  }

  render() {
    const { title, genre, genreBooks } = this.state;
    return (
      <div>
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
      </div>
    );
  }
}

export default GenreDetail;
