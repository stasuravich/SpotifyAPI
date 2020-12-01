import React, {memo} from 'react';
import '../Css/Online.css';

const Online = memo(props=> {

  const seePlaylists=e=>{
    document.getElementById("PopUp").style.marginTop=e.currentTarget.id+"px";
    if(!props.open || (props.addingTrack && props.addingTrack===e.currentTarget.value)){

      props.setOpen(!props.open);
    }
    props.setAddingTrack(e.currentTarget.value);
  }
  const addSong=e=> {
    props.setOpen(!props.open);
    props.setAddingId(e.target.id);
    props.setOnlineClicked(false);
  }
  return(
    <div className="AboveOnline">
      <div className= "Online">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/ >
        {props.query && (props.songs.tracks.items.length ?
          props.songs.tracks.items.map((item, idx) =>
            <div className="AddParent" key={idx}><button id={idx*23+40} value = {item.uri} onClick={seePlaylists} className="AddButton">

              <i className="fa fa-plus"></i><div className="AddMesage" >&nbsp;Add to playlist</div></button>{item.name}: {item.artists[0].name}</div>) :
            <div> '{props.query}' does not exist </div>)}
      </div>
      <div id ="PopUp" className="PopUp">
      {props.open && props.playlists.map((item, idx) => props.userInfo.display_name===item.owner.display_name &&
        <button className="AddToPlay" key={idx} id = {item.id} onClick={addSong}>{item.name}</button>
      )}
      </div>
    </div>
  );
})
export default Online;
