import React, {memo} from 'react';
import '../Css/Playlists.css';

const Playlists = memo(props=> {
  //console.log("Playlist Component")
  let curTracks;

  const dropdownChanged = async e => {
    props.setPlaylists({selectedPlaylist: e.target.value,
                  listOfPlaylistsFromAPI: props.playlists.listOfPlaylistsFromAPI});
    curTracks = await props.getPlaylist(0, curTracks, e.target.value);
    props.setDispPlaylist(curTracks);
  };

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
