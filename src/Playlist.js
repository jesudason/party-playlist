import React, { Component } from 'react';

export default class Playlist extends Component {
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