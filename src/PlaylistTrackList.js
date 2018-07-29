import React, { Component } from 'react';
import FaArrowUp from 'react-icons/lib/fa/arrow-up';
import FaArrowDown from 'react-icons/lib/fa/arrow-down';
import FaTimesCircle from 'react-icons/lib/fa/times-circle';

export default class PlaylistTrackList extends Component {
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