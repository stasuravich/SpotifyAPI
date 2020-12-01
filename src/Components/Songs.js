import React, {memo} from 'react';
import '../Css/Songs.css';

const Songs = memo(props=>{
  //console.log("SongsComponent");
  document.getElementsByClassName("SearchPlaylist")[0].style.visibility="visible";

  function setColor(artist, name){
    if(props.tracks.selectedTrack.name===name && props.tracks.selectedTrack.artists[0].name===artist){
      return "SongsButtonSelected";
    }
    return "SongsButton";
  }

  const clickSong= e=> {
    if(e.target.id===props.tracks.selectedTrack.id){
      props.player.seek(0);
    }
    else{
      props.setTracks({selectedTrack: props.items[e.target.value].track, listOfTracksFromApi: props.dispPlaylist});
      props.setPlaylistTrack(props.playlists.selectedPlaylist);
    }
  }

  const deleteSong= e=> {
    props.trackDeleted(e.currentTarget.value);
  }

  return(
    <div className="SongsTable">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/ >
      {props.items.length===0 && <li className="NotFound">'{props.query}' does not exist</li>}
      <table>
        <tbody>
          {props.items.map((item, idx) => ( item.track.available_markets.length>0 &&
            <tr key={idx}>
              {<td className="ButtonsParent"><button className={setColor(item.track.artists[0].name, item.track.name)} id={item.track.id} onClick={clickSong} value={idx}> {item.track.name}</button>
                <button className="DelButton" onClick={deleteSong} value={item.track.uri}>
                  <i className="fa fa-trash"></i><div className="DelMesage" >&nbsp;Delete</div></button>
              </td>}
            </tr>
        )) }
        </tbody>

      </table>
    </div>
  );
})

export default Songs;
