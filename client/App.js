import React, { Component } from 'react';

class App extends Component {
  state = { data: null };

  componentDidMount() {
    fetch('/api')
      .then(res => res.json())
      .then(data => this.setState({ data: data.data }));
  }

  render() {
    const { data } = this.state;
    return (
      <div>

        some text
        <p>{data}</p>
      </div>
    );
  }
}

export default App;
