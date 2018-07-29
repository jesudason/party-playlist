import React, { Component } from 'react';

export default class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    }, [])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    return (
      <div className="counter">
        <h4>{Math.round(totalDuration/60)} hours</h4>
      </div>
    );
  }
}