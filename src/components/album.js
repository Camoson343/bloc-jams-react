import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';


class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      currentVolume: 0.5,
      duration: album.songs[0].duration,
      isPlaying: false,
      isHovered: false
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
    this.audioElement.volume = this.state.currentVolume;
  }

    play(){
      this.audioElement.play();
      this.setState({ isPlaying: true });
    }

    pause() {
      this.audioElement.pause();
      this.setState({ isPlaying: false });
    }

    componentDidMount() {
      this.eventListeners = {
    timeupdate: e => {
      this.setState({ currentTime: this.audioElement.currentTime });
    },
    durationchange: e => {
      this.setState({ duration: this.audioElement.duration });
    },
    volumechange: e => {
      this.setState({ currentVolume: this.audioElement.currentVolume});
    }
  };
      this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
      this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
      this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);

       }

    componentWillUnmount() {
      this.audioElement.src = null;
      this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
      this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
      this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);

      }

    setSong(song){
      this.audioElement.src = song.audioSrc;
      this.setState({ currentSong: song });
    }

    handleVolumeChange(e){
      const newVolume = e.target.value;
      this.audioElement.volume = newVolume;
    }

    handleSongClick(song){
      const isSameSong = this.state.currentSong === song;
      if (this.state.isPlaying && isSameSong) {
        this.pause();
      } else {
        if(!isSameSong) {this.setSong(song); }
        this.play();
      }
    }

    handlePrevClick() {
      const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const newIndex = Math.max(0, currentIndex -1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play();
    }

    handleSkipClick(){
      const album = this.state.album.songs;
      const currentIndex = album.findIndex(song => this.state.currentSong === song);
      const newIndex = Math.min(this.state.album.songs.length, currentIndex + 1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play();
    }

    handleTimeChange(e) {
     const newTime = this.audioElement.duration * e.target.value;
     this.audioElement.currentTime = newTime;
     this.setState({ currentTime: newTime });
   }

    formatTime(duration){
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration - minutes * 60);
      if(duration.isNaN){
             return "-:--";
           } else if(seconds < 10){
             return minutes + ":" +0+seconds;
           } else {
             return minutes + ":" + seconds;
           }

  }


    onMouseEnter(index){
      this.setState({isHovered: index})
    }

    onMouseLeave(){
      this.setState({isHovered: false})
    }

    renderIcons(song, index){
        if(this.state.isHovered === index && this.state.isPlaying === false){
          return <span className="ion-md-play" />;
        }if(this.state.isHovered === index && this.state.isPlaying === true && this.state.currentSong !== song){
          return <span className="ion-md-play" />;
        }if(this.state.isHovered === index && this.state.isPlaying === true && this.state.currentSong === song){
          return <span className="ion-md-pause" />;
        }else{
          return index + 1;
        }
    }




  render() {
    return (
      <section className="album">
        <section id="album-info">
         <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
         <div className="album-details">
          <h1 id="album-title">{this.state.album.title}</h1>
          <h2 className="artist">{this.state.album.artist}</h2>
          <div id="release-info">{this.state.album.releaseInfo}</div>
        </div>
       </section>
      <div id="songlist-playerbar">
       <table className="table-hover" id="song-list">
        <colgroup>
          <col id="song-number-column" />
          <col id="song-title-column" />
          <col id="song-duration-column" />
        </colgroup>
        <tbody>
            {
              this.state.album.songs.map( (song, index) =>
                <tr className="song" key={index} onClick={() => this.handleSongClick(song)} onMouseEnter={() => this.onMouseEnter(index)} onMouseLeave={() => this.onMouseLeave()}>
                  <td>{this.renderIcons(song,index)}</td>
                  <td>{song.title}</td>
                  <td>{this.formatTime(song.duration)}</td>
                </tr>
              )
            }

            </tbody>
        </table>
      <PlayerBar
        isPlaying={this.state.isPlaying}
        currentSong={this.state.currentSong}
        currentTime={this.audioElement.currentTime}
        duration={this.audioElement.duration}
        currentVolume={this.audioElement.currentVolume}
        handleSongClick={() => this.handleSongClick(this.state.currentSong)}
        handlePrevClick={() => this.handlePrevClick()}
        handleSkipClick={() => this.handleSkipClick()}
        handleTimeChange={(e) => this.handleTimeChange(e)}
        handleVolumeChange={(e) => this.handleVolumeChange(e)}
        formatTime={(duration) => this.formatTime(duration)}
      />
      </div>
    </section>
    );
  }
}


export default Album;
