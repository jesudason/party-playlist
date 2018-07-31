import React, { Component } from 'react';
import FaPlus from 'react-icons/lib/fa/plus'

export default class SearchInput extends Component {
  constructor() {
    super();
    this.state = {
      songs: {
        name: "",
        id: "",
        album: "",
        artists: {}
      }
    }
  }
    
  handleSearch = (event) => {
    event.preventDefault();
    let input = event.target.value;
    let accessToken = this.props.accessToken;
    let url = 'https://api.spotify.com/v1/search?q=' + input + '&type=track&limit=10'
    if (input.length > 2) {
      fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/json'
        },
      }).then(response => response.json())
        .then(data => {
         let songs = data.tracks.items.map(item => {
            return {
              name: item.name,
              id: item.id,
              album: item.album.name,
              artists: item.artists
            }     
          })
         this.setState({songs});
        })
      }
  }

  addToPlaylist = (event) => {
    event.preventDefault();
    let currentPlaylist = this.props.currentPlaylist;
    let songId = event.currentTarget.id;
    let uris = 'spotify:track:' + songId;
    let url = 'https://api.spotify.com/v1/me/playlists' + currentPlaylist.id + '/tracks?uris=' + uris;
    let accessToken = this.props.accessToken;
    const data = {
      'uris': uris
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),     
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }).catch(error => console.log('Error:', error))
      .then(this.props.refreshPlaylist)  
  }

  render() {
    let songs = this.state.songs;

    return (
      <div id="track-search-div">
        <input type="text" onKeyUp={this.handleSearch} placeholder="search to add tracks"/>
        { (songs.length > 0) ? 
          <div className="tracklist">
            <table>
              <thead>
                <tr>
                  <th className="song-title">Song Title</th>
                  <th className="artist">Artist</th>
                  <th className="album">Album</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {songs.map(song => {
                  return <tr key={song.id}>
                    <th>{song.name}</th>
                    <th>{song.artists.map(artist => artist.name)}</th>
                    <th>{song.album}</th>
                    <th><a title="Add Songs to Playlist"><FaPlus id={song.id} className="add-to-playlist" onClick={this.addToPlaylist}/></a></th>
                  </tr>
                })}
              </tbody>
            </table>
          </div> : ''   
        }
      </div>
    );
  }
}
                    
