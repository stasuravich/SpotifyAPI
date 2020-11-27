import React, {useState} from 'react';
import '../Css/Online.css';

const Online = props=> {
  const [open, setOpen]=useState(false);
  const seePlaylists=e=>{
    setOpen(!open);
    props.setAddingTrack(e.currentTarget.value);
  }
  const addSong=e=> {
    setOpen(!open);
    props.setAddingId(e.target.id);
    props.setOnlineClicked(false);
  }
  return(
    <div className="AboveOnline">
      <div className= "Online">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/ >
        {props.query && (props.songs.tracks.items.length ?
          props.songs.tracks.items.map((item, idx) =>
            <div className="AddParent" key={idx}><button id="AddButton" value = {item.uri} onClick={seePlaylists} className="AddButton">
              <i className="fa fa-plus"></i><div className="AddMesage" >&nbsp;Add to playlist</div></button>{item.name}: {item.artists[0].name}</div>) :
            <div> '{props.query}' does not exist </div>)}
      </div>
      <div className="PopUp">
      {open && props.playlists.map((item, idx) =>
        <button className="AddToPlay" key={idx} id = {item.id} onClick={addSong}>{item.name}</button>
      )}
      </div>
    </div>
  );
}
export default Online;
