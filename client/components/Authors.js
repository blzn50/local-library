import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Authors extends Component {
  state = {
    title: '',
    data: [],
  };

  componentDidMount() {
    fetch('/catalog/authors/')
      .then(res => res.json())
      .then(data => this.setState({
        title: data.title,
        data: data.data,
      }));
  }

  render() {
    const { title, data } = this.state;
    return (
      <div>
        <h1>{title}</h1>
        <ul>
          {data.length > 0 ? (
            data.map(author => (
              <li>
                <Link to={author.url}>{author.name}</Link> ({author.lifespan})
                {/* ({author.dateOfBirth}) - (
                {author.dateOfDeath}) */}
              </li>
            ))
          ) : (
            <li>There are no authors</li>
          )}
        </ul>
      </div>
    );
  }
}

export default Authors;
