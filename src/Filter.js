import React, { Component } from 'react';

export default class Filter extends Component {
  render() {
    return (
      <div>
        <img alt=""/>
        <input type="text" onKeyUp={event => this.props.onTextChange(event.target.value)} placeholder="playlist search"/>
      </div>
    );
  }
}