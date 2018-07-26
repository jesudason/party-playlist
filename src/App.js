import React, { Component } from 'react';
import './App.css';

let defaultStyle = {
  color: 'white'
};

let fakeServerData = {
  user: {
    name: 'Nicole',
    playlists: [
      {
        name: 'my faves',
        songs: [{name: 'Beat it', duration:1345},
          {name: 'Song 2', duration: 1236}, 
          {name: 'Pinacoladas', duration: 70000}]
      },
      {
        name: 'weekly',
        songs: [{name: 'linoleum', duration: 1236},
          {name: '#1 crush', duration: 1236}, 
          {name: 'thong song', duration: 1236}]
      },
      {
        name: 'playlists are boring',
        songs: [{name: 'bananas', duration: 1236}, 
          {name: 'car song', duration: 1236},
          {name: 'toe jamz', duration: 1236}]
      },
      {
        name: 'blah',
        songs: [{name: 'macarena', duration:1345},
          {name: 'hammer time', duration:1345},
          {name: 'bicycle', duration:1345}]
      }
    ]
  },

};

class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width: "40%", display: "inline-block"}} className="aggregate">
        <h2>{this.props.playlists.length} playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    }, [])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    return (
      <div style={{...defaultStyle, width: "40%", display: "inline-block"}} className="aggregate">
        <h2>{Math.round(totalDuration/60)} hours</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle}>
        <img/>
        <input type="text"/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width:"25%", display:"inline-block"}}>
        <img/>
        <h3>Playlist Name</h3>
        <ul><li>Song 1</li><li>Song 2</li><li>Song 3</li></ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {serverData: {}}
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({serverData: fakeServerData});
    }, 1000);
  }
  render() {
    return (
      <div className="App">
        {this.state.serverData.user && 
        <div>
          <h1 style={{...defaultStyle, 'font-size': "54px"}}>
            {this.state.serverData.user.name}'s Playlist
          </h1>
            <PlaylistCounter playlists={this.state.serverData.user && this.state.serverData.user.playlists}/>
            <HoursCounter playlists={this.state.serverData.user && this.state.serverData.user.playlists}/>
          <Filter/>
          <Playlist/>
          <Playlist/>
          <Playlist/>
          <Playlist/>
        </div>} : <h1 style={{defaultStyle}}>Loading...</h1>
      </div>
    );
  }
}

export default App;
