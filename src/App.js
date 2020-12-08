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
  const [cred, setCred]=useState();
  const playlists = useRef({selectedPlaylist:'', listOfPlaylistsFromAPI: []});
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
          playlists.current={listOfPlaylistsFromAPI: response.data.items};
          setCred("right");
        })
        .catch(_=>{
            setCred("wrong");
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
      {(!cred || cred==="wrong") ? <Login setLoggedIn={setLogInfo} cred={cred} setCred={setCred}/>:
      <>
        <Search class="SearchPlaylist" placeh="Search playlist" setQuery={setQPlaylist}/>
        <SearchAndSearchRes logInfo={logInfo} playlists={playlists} getPlaylist={getPlaylist} playlistTrack={playlistTrack} setTracks={setTracks} tracks={tracks} setDispPlaylist={setDispPlaylist}/>
        <Playlists playlists= {playlists} setDispPlaylist={setDispPlaylist} getPlaylist={getPlaylist} />
        <div className="Box">
          {dispPlaylist && <Songs logInfo={logInfo} playlists={playlists} tracks={tracks} setTracks = {setTracks} playlistTrack={playlistTrack} dispPlaylist={dispPlaylist} setDispPlaylist={setDispPlaylist} query={qPlaylist} getPlaylist={getPlaylist}/> }
          {tracks.selectedTrack && <Details access_token={logInfo} tracks={tracks} setTracks={setTracks} playlistTrack={playlistTrack}/>}
        </div>
      </>}
    </div>
  );
}
export default App;
