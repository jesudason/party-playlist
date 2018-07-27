import React, { Component } from 'react';
import './App.css';
import FaArrowUp from 'react-icons/lib/fa/arrow-up';
import FaArrowDown from 'react-icons/lib/fa/arrow-down';
import FaTimesCircle from 'react-icons/lib/fa/times-circle';
// import queryString from 'query-string'

let defaultStyle = {
  color: '#fff'
};
// let fakeServerData = {
//   user: {
//     name: 'Nicole',
//     playlists: [
//       {
//         name: 'my faves',
//         songs: [
//           {name: 'Beat it', duration:1345},
//           {name: 'Song 2', duration: 1236}, 
//           {name: 'Pinacoladas', duration: 70000}
//         ]
//       }
//     ]
//   },
// };

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
        <img alt=""/>
        <input type="text" onKeyUp={event => this.props.onTextChange(event.target.value)}/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist;
    let handleClick = this.props.handleClick;

    return (
      <div style={{...defaultStyle, width:"25%", display:"inline-block"}} onClick={handleClick} id={playlist.id} >
        <img alt="" src={playlist.imageUrl} id={playlist.id} style={{width: '60px'}}/>
        <h3 id={playlist.id} >{playlist.name}</h3>
{/*        <ul>
          {playlist.songs.map(song => 
            <li key={song.id}>{song.name}</li>
          )}
        </ul>*/}
      </div>
    );
  }
}

class PlaylistTrackList extends Component {
  render() {
    let currentPlaylist = this.props.currentPlaylist
    let songs = this.props.tracks && this.props.tracks.songs
    return (
      <div style={defaultStyle}>
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
        name: data.display_name
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
    console.log(event.target)
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
          <h1 style={{...defaultStyle, 'fontSize': "54px"}}>
            {this.state.user.name}'s Playlist
          </h1>   
          <PlaylistCounter playlists={playlistToRender}/>
          <HoursCounter playlists={playlistToRender}/>
          <Filter onTextChange={text => {
            this.setState({filterString: text})
          }}/>
          {playlistToRender.map(playlist => 
            <Playlist playlist={playlist} key={playlist.id} handleClick={this.handleClick}/>
          )}
        </div> : <button onClick={() => {
          window.location = window.location.href.includes('localhost')
            ? 'http://localhost:8888/login'
            : 'https://playlistparty-backend.herokuapp.com/' }
          }
          style={{padding: '20px', 'fontSize': '20px', 'marginTop': '20px'}}>Sign In to Spotify</button>
        }
        {this.state.currentPlaylist &&
          <PlaylistTrackList currentPlaylist={this.state.currentPlaylist} tracks={playlistTracksToRender}/>}
      </div>
    );
  }
}

export default App;
