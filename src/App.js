import React, { Component } from 'react';
import './App.css';
import FaArrowUp from 'react-icons/lib/fa/arrow-up';
import FaArrowDown from 'react-icons/lib/fa/arrow-down';
import FaTimesCircle from 'react-icons/lib/fa/times-circle';
import PlaylistCounter from './PlaylistCounter';
import HoursCounter from './HoursCounter';
import Filter from './Filter';
import LoginScreen from './LoginScreen'
import UserHeading from './UserHeading'

let defaultStyle = {
  color: '#fff'
};

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist;
    let handleClick = this.props.handleClick;

    return (
      <div className="playlist-div blue-red" onClick={handleClick} id={playlist.id} >
        <img alt="" src={playlist.imageUrl} id={playlist.id}/>
        <h3 id={playlist.id} >{playlist.name}</h3>
      </div>
    );
  }
}

class PlaylistTrackList extends Component {
  render() {
    let currentPlaylist = this.props.currentPlaylist
    let songs = this.props.tracks && this.props.tracks.songs
    return (
      <div className="tracklist">
        <table>
          <thead>
            <tr>
              <th>Song Title</th>
              <th>Artist</th>
              <th>Vote</th>
            </tr>
          </thead>
          <tbody>
            {songs.map(song =>
              <tr key={song.id} >
                <th>{song.name}</th>
                <th>
                  {song.artists.map(artist => 
                    <span key={artist.name}>{artist.name} </span>
                  )}
                </th>
                <th>
                  <span className="up-icon"><FaArrowUp data-tag={currentPlaylist.id}/></span> &ensp;
                  <span className="down-icon"><FaArrowDown data-tag={currentPlaylist.id}/></span>&ensp; 
                  <span className="delete-icon"><FaTimesCircle data-tag={song.id}/></span>
                </th>
              </tr>
            )}
          </tbody>  
        </table>        
      </div>
    );
  }  
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: '',
      currentPlaylist: ''
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
        name: data.display_name,
        img: data.images[0].url
      }
    }))

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(playlistData => {
      let playlists = playlistData.items
      let trackDataPromises = playlists.map(playlist => {
        let responsePromise = fetch(playlist.tracks.href, {
          headers: {'Authorization': 'Bearer ' + accessToken}
        })
      let trackDataPromise = responsePromise      
        .then(response => response.json())
      return trackDataPromise
      })
      let allTracksDataPromises = 
        Promise.all(trackDataPromises)

      let playlistsPromise = allTracksDataPromises.then(trackDatas => {
        trackDatas.forEach((trackData, i) => {
          playlists[i].trackDatas = trackData.items
            .map(item => item.track)
            .map(trackData => ({
              name: trackData.name,
              duration: trackData.duration_ms / 1000,
              id: trackData.id,
              artists: trackData.artists
            }))
        })
        return playlists
      })
      return playlistsPromise
    })
    .then(playlists => this.setState({
      playlists: playlists.map(item => {
        return {
          name: item.name,
          imageUrl: item.images[0].url,
          songs: item.trackDatas,
          id: item.id
        }
    })
    }))    
  }

  handleClick = (event) => {
    this.setState({currentPlaylist: event.target})
    console.log(this.state.currentPlaylist)
  }

  render() {
    let playlistToRender = 
      this.state.user && 
      this.state.playlists
        ? this.state.playlists.filter(playlist =>
          playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase())) 
        : [];
    let playlistTracksToRender =
      this.state.currentPlaylist &&
      this.state.playlists
        ? this.state.playlists.find(playlist => playlist.id === this.state.currentPlaylist.id)
        : [];    
    return (
      <div className="App">
        {this.state.user ? 
        <div>
          <div className="header">
            <div className="banner">
              <div className="logo">
                <h2>Party Playlist</h2>
              </div>
              <UserHeading user={this.state.user}/>
            </div>
            <div className="counters">
              <PlaylistCounter playlists={playlistToRender}/>
              <HoursCounter playlists={playlistToRender}/>
            </div>
            <Filter onTextChange={text => {
              this.setState({filterString: text})
            }}/>
          </div>
          <div className="playlist-display">
            {playlistToRender.map(playlist => 
              <Playlist playlist={playlist} key={playlist.id} handleClick={this.handleClick}/>
            )}
          </div>

          {this.state.currentPlaylist &&
            <PlaylistTrackList currentPlaylist={this.state.currentPlaylist} tracks={playlistTracksToRender}/>}

        </div> : <LoginScreen/>
        }
      </div>
    );
  }
}

export default App;
