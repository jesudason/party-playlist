import React, { Component } from 'react';

export default class LoginScreen extends Component {
  render() {

    return (
      <div className="login-screen">
        <div className="logo">
          <h2>Party Playlist</h2>
        </div>
        <button className="login-btn" onClick={() => {
          window.location = window.location.href.includes('localhost')
            ? 'http://localhost:8888/login'
            : 'https://playlistparty-backend.herokuapp.com/' }
          }>Sign In to Spotify</button>
      </div>
    );
  }  
}