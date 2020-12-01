import React, {memo} from 'react';
import '../Css/Playlists.css';


const Playlists = memo(props=> {
  //console.log("Playlist Component")
  const dropdownChanged = e => {
      props.changed(e.target.value);

  }
  return(
    <div className= "Playlists">

      <label className="PlaylistLabel">Playlist: </label>
      <select className= "PlaylistsContent" onChange={dropdownChanged}>
        {!props.playlists.selectedPlaylist &&<option key={0}>Select...</option>}
        {props.playlists.listOfPlaylistsFromAPI.map((item, idx) => <option key={idx + 1} value={item.id}>{item.name}</option> )}

      </select>

    </div>
  );
})

export default Playlists
