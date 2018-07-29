import React, { Component } from 'react';

export default class Playlist extends Component {
  render() {
    let user = this.props.user;
    return (
      <div className="profile-div">
        <img src={user.img} alt="" className="profile-pic"/>  
        <h5>
          {user.name}
        </h5>
      </div>
    );
  }
}