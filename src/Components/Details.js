import React from 'react';
import '../Css/Details.css';
import axios from 'axios'

const Details = props => {
  function onPrevClick(){
    axios('https://api.spotify.com/v1/me/player/previous', {
      method: 'POST',
      headers: {'Authorization' : 'Bearer ' + props.access_token}
    })
  }

  const onPlayClick=_=>{
    props.player.togglePlay();
  }

  function onNextClick(){
    axios('https://api.spotify.com/v1/me/player/next', {
      method: 'POST',
      headers: {'Authorization' : 'Bearer ' + props.access_token}
    })
  }

  const position=e=>{
    props.player.seek(props.duration*e.target.value);
  }

  return (
    <div className="SongDetails">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/ >
      <img className="Image" src = {props.details.album.images[0].url} alt = {props.artists[0]}></img>
      <div>
        <label className="Name">{props.details.name}</label>
      </div>
      <div>
        <label className="Artist">{props.artists[0].name}</label>
      </div>

      <div><input type="range" className="Seekbar" id="seekbar" min="0" max="1" step="0.001" defaultValue="0" onChange={position}/></div>
      <button className="Toggle" onClick={onPrevClick}><i className="fa fa-backward"></i></button>
      <button className="Pause" onClick={onPlayClick}>{props.playing ? <i className="fa fa-pause"></i>: <i className="fa fa-play"></i>}</button>
      <button className="Toggle" onClick={onNextClick}><i className="fa fa-forward"></i></button>
    </div>
  );
}

export default Details;
