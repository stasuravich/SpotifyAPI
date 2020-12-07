import React, {useState, useEffect, useRef} from 'react';
import './App.css';
//import SpotifyWeb from 'spotify-web-api-js';
import Playlists from './Components/Playlists';
import Songs from './Components/Songs';
import Details from './Components/Details';
import Search from './Components/Search';
import Login from './Components/Login';
import SearchAndSearchRes from './Components/SearchAndSearchRes';

import axios from 'axios';

//var spotifyWebApi = new SpotifyWeb();

function App() {
  //console.log("In App");
  const [logInfo, setLogInfo]=useState('');
  const [wrong, setWrong]=useState(false);
  const [playlists, setPlaylists] = useState({selectedPlaylist:'', listOfPlaylistsFromAPI: []});
  const [dispPlaylist, setDispPlaylist] = useState();
  const [tracks, setTracks] = useState({selectedTrack:'', listOfTracksFromApi: ''});
  const [qPlaylist, setQPlaylist] = useState('');
  const playlistTrack=useRef();
  //const params = getHashParams();

  useEffect(()=> {
    if (logInfo){
      //spotifyWebApi.setAccessToken(logInfo);
      axios('https://api.spotify.com/v1/me/playlists', {
          method: 'GET',
          headers: {'Authorization' : 'Bearer ' + logInfo}
        })
        .then((response) => {
          setPlaylists({listOfPlaylistsFromAPI: response.data.items});
        })
        .catch(_=>{
            setWrong(true);
          })
    }
  }, [logInfo]);


  // function getHashParams() {
  //   var hashParams = {};
  //   var e, r = /([^&;=]+)=?([^&;]*)/g,
  //       q = window.location.hash.substring(1);
  //   while ( e = r.exec(q)) {
  //      hashParams[e[1]] = decodeURIComponent(e[2]);
  //   }
  //   return hashParams;
  // }
  const getPlaylist= async (offset, curTracks, val)=>{
    await axios(`https://api.spotify.com/v1/playlists/${val}/tracks?offset=${offset}`, {
      method: 'GET',
      headers: {'Authorization' : 'Bearer ' + logInfo}
    })
    .then (response => {
      if(curTracks){
        curTracks.push(...response.data.items);
      }
      else{
        curTracks=response.data.items;
      }
      if(response.data.items.length===100){
        curTracks= getPlaylist(offset+100, curTracks, val);
      }
    })
    return curTracks;
  };

  return (
    <div className="App">
      {!playlists.listOfPlaylistsFromAPI.length ? <Login setLoggedIn={setLogInfo} wrong={wrong} setWrong={setWrong}/>:
      <>
        <Search class="SearchPlaylist" placeh="Search playlist" setQuery={setQPlaylist}/>
        <SearchAndSearchRes logInfo={logInfo} playlists={playlists} getPlaylist={getPlaylist} playlistTrack={playlistTrack} setTracks={setTracks} tracks={tracks} setDispPlaylist={setDispPlaylist}/>
        <Playlists playlists= {playlists} setDispPlaylist={setDispPlaylist} getPlaylist={getPlaylist} setPlaylists={setPlaylists} />
        <div className="Box">
          {dispPlaylist && <Songs logInfo={logInfo} playlists={playlists} tracks={tracks} setTracks = {setTracks} playlistTrack={playlistTrack} dispPlaylist={dispPlaylist} setDispPlaylist={setDispPlaylist} query={qPlaylist} getPlaylist={getPlaylist}/> }
          {tracks.selectedTrack && <Details access_token={logInfo} tracks={tracks} setTracks={setTracks} playlistTrack={playlistTrack}/>}
        </div>
      </>}
    </div>
  );
}
export default App;
