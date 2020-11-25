import React from 'react';
import '../Css/Songs.css';

const Songs = props=> {
  document.getElementsByClassName("SearchPlaylist")[0].style.visibility="visible";
  const clickSong= e=> {
    props.setTracks({selectedTrack: e.target.id, listOfTracksFromApi: props.tracks});
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
          {props.items.map((item, idx) => (
            <tr key={idx}>
              {<td className="ButtonsParent"><button className="SongsButton" onClick={clickSong} value = {item.track.uri} id={item.track.id}> {item.track.name}</button>
                <button className="DelButton" onClick={deleteSong} value={item.track.uri}>
                  <i className="fa fa-trash"></i><div className="DelMesage" >&nbsp;Delete</div></button>
              </td>}
            </tr>
        )) }
        </tbody>

      </table>
    </div>
  );
}

export default Songs;
