import React, { Component } from 'react';
import './App.css';
// import queryString from 'query-string'

let defaultStyle = {
  color: '#fff'
};
let fakeServerData = {
  user: {
    name: 'Nicole',
    playlists: [
      {
        name: 'my faves',
        songs: [
          {name: 'Beat it', duration:1345},
          {name: 'Song 2', duration: 1236}, 
          {name: 'Pinacoladas', duration: 70000}
        ]
      }
    ]
  },
};

class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width: "40%", display: "inline-block"}}>
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
      <div style={{...defaultStyle, width: "40%", display: "inline-block"}}>
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
        <input type="text" onKeyUp={event => this.props.onTextChange(event.target.value)}/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist;
    return (
      <div style={{...defaultStyle, width:"25%", display:"inline-block"}}>
        <img src={playlist.imageUrl} style={{width: '60px'}}/>
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song => 
            <li>{song.name}</li>
          )}
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: ''
    }
  }
  componentDidMount() {
    let params = (new URL(document.location)).searchParams;
    let accessToken = params.get("access_token");
    if (!accessToken)
      return;
    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
      user: {
        name: data.display_name
      }
    }))

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
      playlists: data.items.map(item => {
        return {
          name: item.name,
          imageUrl: item.images[0].url,
          songs: []
        }
    })
    }))    
  
  }
  render() {
    let playlistToRender = 
      this.state.user && 
      this.state.playlists
        ? this.state.playlists.filter(playlist =>
          playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase())) 
        : [];
    return (
      <div className="App">
        {this.state.user ? 
        <div>
          <h1 style={{...defaultStyle, 'font-size': "54px"}}>
            {this.state.user.name}'s Playlist
          </h1>   
          <PlaylistCounter playlists={playlistToRender}/>
          <HoursCounter playlists={playlistToRender}/>
          <Filter onTextChange={text => {
            this.setState({filterString: text})
          }}/>
          {playlistToRender.map(playlist => 
            <Playlist playlist={playlist}/>
          )}
        </div> : <button onClick={() => {
          window.location = window.location.includes('localhost')
            ? 'http://localhost:8888/login'
            : 'https://playlistparty.herokuapp.com/' }
          }
          style={{padding: '20px', 'font-size': '20px', 'margin-top': '20px'}}>Sign In to Spotify</button>
        }
      </div>
    );
  }
}

export default App;
