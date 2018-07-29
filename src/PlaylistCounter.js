import React, { Component } from 'react';

export default class PlaylistCounter extends Component {
  render() {
    return (
      <div className="counter">
        <h4>{this.props.playlists.length} playlists</h4>
      </div>
    );
  }
}