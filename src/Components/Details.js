import React, {useState, useEffect} from 'react';
import '../Css/Details.css';
import axios from 'axios'

const Details = props => {
  const [playing, setPlaying]=useState();
  const [duration, setDuration]=useState();
  useEffect(() => {
    if(props.player){
      props.player.on('player_state_changed', state => {

        if(state){
          setPlaying(!state.paused);
          setDuration(state.duration);
          //console.log("In player")
        }
      });
    }
  }, [props.player]);

  const compute = _ =>{
    let count=0;
    for(const elem of props.tracks.listOfTracksFromApi.entries()){
      if(props.tracks.selectedTrack.id===elem[1].track.id){
        return count;
      }
      count++;
    }
    return -1;
  }
  function onPrevClick(){
    if(props.tracks.listOfTracksFromApi[0].track.name===props.tracks.selectedTrack.name){
      props.player.seek(0);
    }
    else{
      let index=compute();
      if (index>-1){
        props.setTracks({selectedTrack: props.tracks.listOfTracksFromApi[index-1].track, listOfTracksFromApi: props.tracks.listOfTracksFromApi});
      }
      else{
        props.player.previousTrack();
      }
    }

  }

  const onPlayClick=_=>{

    props.player.togglePlay();
  }

  function onNextClick(){
    let index=compute();
    if(props.tracks.listOfTracksFromApi[props.tracks.listOfTracksFromApi.length-1].track.id===props.tracks.selectedTrack.id || index===-1){
      props.player.nextTrack();
    }
    else{

      props.setTracks({selectedTrack: props.tracks.listOfTracksFromApi[index+1].track, listOfTracksFromApi: props.tracks.listOfTracksFromApi});
    }
  }

  const position=e=>{
    props.player.seek(duration*e.target.value);
  }

  const volume=e=>{
    axios('https://api.spotify.com/v1/me/player/volume?volume_percent='+e.target.value*100, {
      method: 'PUT',
      headers: {'Authorization' : 'Bearer ' + props.access_token}
    })
  }

  return (
    <div className="SongDetails">

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/ >
      <img className="Image" src = {props.tracks.selectedTrack.album.images[0].url} alt = {props.tracks.selectedTrack.artists[0]}></img>
      <div>
        <label className="Name">{props.tracks.selectedTrack.name}</label>
      </div>
      <div>
        <label className="Artist">{props.tracks.selectedTrack.artists[0].name}</label>
      </div>

      <div><input type="range" className="Seekbar" id="seekbar" min="0" max="1" step="0.001" defaultValue="0" onChange={position}/></div>

      <button className="Toggle" onClick={onPrevClick}><i className="fa fa-backward"></i></button>
      <button className="Pause" id="Pause" onClick={onPlayClick}>{playing ? <i className="fa fa-pause"></i>: <i className="fa fa-play"></i>}</button>
      <button className="Toggle" onClick={onNextClick}><i className="fa fa-forward"></i></button>

      <div className="Volume"><i className="fa fa-volume-up"></i><input type="range" min="0" max="1" step="0.05" defaultValue="1" onChange={volume}/></div>
    </div>
  );
}

export default Details;
