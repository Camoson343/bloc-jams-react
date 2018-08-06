import React, { Component } from 'react';
import albumData from './../data/albums';

class Library extends Component {
  constructor(props) {
    super(props);
    this.state = { albums: albumData };
  }

  render() {
    return (
      <section className='library'>
        {
          this.state.albums.map( (album, index) =>
            <div key={index} >
              {album.title}
            </div>
          )
        }
      </section>
    );
  }
}

export default Library;
