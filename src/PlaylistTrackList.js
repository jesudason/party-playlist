import React, { Component } from 'react';
import FaArrowUp from 'react-icons/lib/fa/arrow-up';
import FaArrowDown from 'react-icons/lib/fa/arrow-down';
import FaTimesCircle from 'react-icons/lib/fa/times-circle';

export default class PlaylistTrackList extends Component {

  upVote = (event) => {
    event.preventDefault();
    let refreshPlaylist = this.props.refreshPlaylist;
    let accessToken = this.props.accessToken;
    let currentPlaylist = this.props.currentPlaylist;
    let currentSongPosition = Number(event.currentTarget.id);
    let refreshUrl = 'https://api.spotify.com/v1/users/me/playlists/' + currentPlaylist.id;
    let url = refreshUrl + '/tracks'; 
    const data = {
      'range_start': currentSongPosition,
      'range_length': 1,
      'insert_before': currentSongPosition - 1
    }

    // if song is not first in the playlist, move it up the playlist, then retrieve new order from spotify 
    if (currentSongPosition !== 0) {
      fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data), 
        redirect: 'follow',    
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      }).catch(error => console.log('Error:', error))
        .then(refreshPlaylist)
    }
  }
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
                <th className="song-title">{song.name}</th>
                <th className="artist">
                  {song.artists.map(artist => 
                    <span key={artist.name}>{artist.name} </span>
                  )}
                </th>
                <th className="icons">
                  <span className="up-icon"><FaArrowUp data-tag={currentPlaylist.id} id={songs.indexOf(song)} onClick={this.upVote}/></span> &ensp;
                  <span className="down-icon"><FaArrowDown data-tag={currentPlaylist.id} id={song.position}/></span>&ensp; 
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