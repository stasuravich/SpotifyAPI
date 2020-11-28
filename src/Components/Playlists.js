import React from 'react';
import '../Css/Playlists.css';


const Playlists = props=> {

  const dropdownChanged = e => {
      props.changed(e.target.value);

  }
  return(
    <div className= "Playlists">

      <label className="PlaylistLabel">Playlist: </label>
      <select className= "PlaylistsContent" onChange={dropdownChanged}>
        {!props.playlist &&<option key={0}>Select...</option>}
        {props.items.map((item, idx) => <option key={idx + 1} value={item.id}>{item.name}</option> )}

      </select>

    </div>
  );
}

export default Playlists
