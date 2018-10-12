import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
            <Link to={`/album/${album.slug}`} key={index}>
            <div id="library-album-block" className="d-inline-block">
                  <img id="library-img" src={album.albumCover} alt={album.title} />
              <div id="album-info-library">
                  <div>{album.title}</div>
                  <div>{album.artist}</div>
                  <div>{album.songs.length} songs</div>
              </div>
            </div>
            </Link>
          )
        }
      </section>
    );
  }
}

export default Library;
