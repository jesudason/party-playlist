import React, { Component } from 'react';
import FaArrowUp from 'react-icons/lib/fa/arrow-up';
import FaArrowDown from 'react-icons/lib/fa/arrow-down';
import FaTimesCircle from 'react-icons/lib/fa/times-circle';
import FaPlus from 'react-icons/lib/fa/plus'

export default class PlaylistTrackList extends Component {

  render() {
    let accessToken = this.props.accessToken;
    let currentPlaylist = this.props.currentPlaylist;
    let refreshPlaylist = this.props.refreshPlaylist;
    let refreshUrl = 'https://api.spotify.com/v1/users/me/playlists/' + currentPlaylist.id;
    let url = refreshUrl + '/tracks'; 
    let songs = this.props.tracks.songs;
    let showSearchResDiv = this.props.showSearchResDiv;
    
    let upVote = (event) => {
      event.preventDefault();
      let currentSongPosition = Number(event.currentTarget.id);
      // tell spotify how you want the tracks to move
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

    let downVote = (event) => {
      event.preventDefault();
      let currentSongPosition = Number(event.currentTarget.id);
      // tell spotify how you want the tracks to move
      const data = {
        'range_start': currentSongPosition,
        'range_length': 1,
        'insert_before': currentSongPosition + 2
      }
      // if song is not first in the playlist, move it up the playlist, then retrieve new order from spotify 
      if (currentSongPosition !== songs.length -1) {
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

    let deleteFromPlaylist = (event) => {
      event.preventDefault();
      let uris = 'spotify:track:' + event.currentTarget.dataset.tag;
      const data = {
        'tracks' : [{"uri": uris}]
      }
      fetch(url, {
        method: 'DELETE',
        body: JSON.stringify(data),     
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      }).catch(error => console.log('Error:', error))
        .then(refreshPlaylist)    
    }
    
    return (
      <div className="tracklist" id="tracklist">
        <p className="add-tracks-btn" id="show-search-btn" title="Load track search" onClick={showSearchResDiv}><FaPlus/> Add Songs to Playlist</p>
        <table>
          <thead>
            <tr>
              <th><a title="Add Songs to Playlist">Song Title</a></th>
              <th>Artist</th>
              <th>Vote</th>
            </tr>
          </thead>
          <tbody>
            {songs.map(song =>
              <tr className="highlight-on-select" key={song.id} >
                <th className="song-title">{song.name}</th>
                <th className="artist">{song.artists.map(artist => artist.name)}</th>
                <th className="icons">
                  <span className="up-icon icon"><FaArrowUp data-tag={currentPlaylist.id} id={songs.indexOf(song)} onClick={upVote}/></span> &ensp;
                  <span className="down-icon icon"><FaArrowDown key={currentPlaylist.id} id={songs.indexOf(song)} onClick={downVote}/></span>&ensp; 
                  <span className="delete-icon icon"><FaTimesCircle data-tag={song.id} onClick={deleteFromPlaylist}/></span>
                </th>
              </tr>
            )}
          </tbody>  
        </table>        
      </div>
    );
  }  
}