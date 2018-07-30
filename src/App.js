import React, { Component } from 'react';
import './App.css';
import PlaylistCounter from './PlaylistCounter';
import HoursCounter from './HoursCounter';
import Filter from './Filter';
import LoginScreen from './LoginScreen'
import UserHeading from './UserHeading'
import Playlist from './Playlist'
import PlaylistTrackList from './PlaylistTrackList'

let defaultStyle = {
  color: '#fff'
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: '',
      currentPlaylist: '',
      accessToken: ''
    }
  }
  componentDidMount() {
    let params = (new URL(document.location)).searchParams;
    let accessToken = params.get("access_token");
    this.setState({accessToken: accessToken})
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
  }

    // function to retrieve the new song order from spotify
  refreshPlaylist = () => {
    let thisPlaylist = this.state.playlists.find(playlist => playlist.id === this.state.currentPlaylist.id)
    let thisPlaylistIndex = this.state.playlists.indexOf(thisPlaylist);
    let refreshUrl = 'https://api.spotify.com/v1/users/me/playlists/' + this.state.currentPlaylist.id;
    let playlists = this.state.playlists;
      fetch(refreshUrl, {
        headers: {'Authorization': 'Bearer ' + this.state.accessToken}
      }).then(response => response.json())
        .then(data => {
          let songsPromise = data.tracks.items;
          return Promise.all(songsPromise).then(songsData => {
            let temp = songsData.map(song => {
                return {
                  name: song.track.name,
                  duration:song.track.duration_ms / 1000,
                  id: song.track.id,
                  artists: song.track.artists
                }
              })
            playlists[thisPlaylistIndex].songs = temp;
            this.setState({playlists});
          })

        }).then(console.log(this.state)) 
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
                <h2>Playlist Party</h2>
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
            <PlaylistTrackList currentPlaylist={this.state.currentPlaylist} tracks={playlistTracksToRender} accessToken={this.state.accessToken} refreshPlaylist={this.refreshPlaylist} />}

        </div> : <LoginScreen/>
        }
      </div>
    );
  }
}

export default App;
