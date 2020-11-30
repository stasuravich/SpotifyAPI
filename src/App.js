import React, {useState, useEffect, useRef} from 'react';
import './App.css';
//import SpotifyWeb from 'spotify-web-api-js';
import Script from 'react-load-script';
import Playlists from './Components/Playlists';
import Songs from './Components/Songs';
import Details from './Components/Details';
import Search from './Components/Search';
import Online from './Components/Online';
import Login from './Components/Login';
import axios from 'axios';
import {detect} from 'detect-browser'
const browser=detect();

//var spotifyWebApi = new SpotifyWeb();

function App() {
  const [logInfo, setLogInfo]=useState('');
  const [wrong, setWrong]=useState(false);
  const [userInfo, setUserInfo]=useState();
  const [playlists, setPlaylists] = useState({selectedPlaylist:'', listOfPlaylistsFromAPI: []});
  const [playlistTrack, setPlaylistTrack]=useState();
  const [dispPlaylist, setDispPlaylist] = useState();
  const [tracks, setTracks] = useState({selectedTrack:'', listOfTracksFromApi: ''});
  const [qPlaylist, setQPlaylist] = useState('');
  const [qOnline, setQOnline] = useState();
  const [searchRes, setSearchRes] = useState();
  const [addingTrack, setAddingTrack]=useState();
  const [onlineClicked, setOnlineClicked]=useState(false);
  const [playing, setPlaying]=useState();
  const [player, setPlayer]=useState();
  const [addingId, setAddingId]=useState();
  const [addSong, setAddSong]= useState(false);
  const [device, setDevice]=useState();
  const [duration, setDuration]=useState();
  const [open, setOpen]=useState(false);
  const inputRef = useRef();
  //const params = getHashParams();
  window.onSpotifyWebPlaybackSDKReady = () => {
    setPlayer(new window.Spotify.Player({      // Spotify is not defined until
      name: 'Spotify Web Player',            // the script is loaded in
      getOAuthToken: cb => {cb(logInfo)}
    }))
  }

  useEffect(()=> {
    if (logInfo){
      //spotifyWebApi.setAccessToken(logInfo);
      axios('https://api.spotify.com/v1/me', {
          method: 'GET',
          headers: {'Authorization' : 'Bearer ' + logInfo}
        })
        .then((response) => {
          setUserInfo(response.data);
        })
        .catch(_=>{
          setLogInfo(null)
          setWrong(true);
        })
      axios('https://api.spotify.com/v1/me/playlists', {
          method: 'GET',
          headers: {'Authorization' : 'Bearer ' + logInfo}
        })
        .then((response) => {
          setPlaylists({listOfPlaylistsFromAPI: response.data.items});
        })
      }
  }, [logInfo]);

  useEffect(()=> {
    if(qOnline){
      axios(`https://api.spotify.com/v1/search?limit=15&type=track&q=${qOnline}`, {
          method: 'GET',
          headers: {'Authorization' : 'Bearer ' + logInfo}
        })
        .then((response) => {
          setSearchRes(response.data);
        })
    }
  }, [qOnline]);

  function search(rows, query) {
    return rows.filter(row=>row.track.name.toLowerCase().indexOf(query.toLowerCase()) > -1)
  }

  // function getHashParams() {
  //   var hashParams = {};
  //   var e, r = /([^&;=]+)=?([^&;]*)/g,
  //       q = window.location.hash.substring(1);
  //   while ( e = r.exec(q)) {
  //      hashParams[e[1]] = decodeURIComponent(e[2]);
  //   }
  //   return hashParams;
  // }
  async function getPlaylist(offset, curTracks, val){
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
  }

  async function playlistChanged(val){
    setPlaylists({selectedPlaylist: val,
                  listOfPlaylistsFromAPI: playlists.listOfPlaylistsFromAPI})
    let offset=0;
    let curTracks;
    curTracks = await getPlaylist(offset, curTracks, val);
    setDispPlaylist(curTracks);
  };
  function request(device){
    axios(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + logInfo
      },
      data: {"context_uri": "spotify:playlist:"+[playlistTrack], "offset": {"uri": "spotify:track:"+tracks.selectedTrack.id}}
    })
  }


  useEffect(()=>{
    if(tracks.selectedTrack){
      //console.log("In tracks.selected")
      if(browser.name!=='safari'){
        player.connect();
        player.getCurrentState().then(state => {
          if(state) {
            if(state.track_window.current_track.name!==tracks.selectedTrack.name || state.track_window.current_track.artists[0].name!==tracks.selectedTrack.artists[0].name){
              request(device)
            }
          }
        });
        player.addListener('ready', ({device_id})=>{
          setDevice(device_id);
          request(device_id);
        })
        const interval = setInterval(() => {
          player.getCurrentState().then(state => {
            if(state){
              if(state.track_window.current_track.name!==tracks.selectedTrack.name || state.track_window.current_track.artists[0].name!==tracks.selectedTrack.artists[0].name){
                setTracks({selectedTrack: state.track_window.current_track, listOfTracksFromApi: tracks.listOfTracksFromApi});
              }
              //console.log("Check state")
              document.getElementById("seekbar").value= state.position/state.duration;
            }
          })
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  },[tracks.selectedTrack])

  useEffect(() => {
    if(player){
      player.on('player_state_changed', state => {

        if(state){
          setPlaying(!state.paused);
          setDuration(state.duration);
          //console.log("In player")
        }
      });
    }
  }, [player]);

  function trackDeleted(uri){
    axios(`https://api.spotify.com/v1/playlists/${playlists.selectedPlaylist}/tracks`, {
      method: "DELETE",
      headers: {'Authorization' : 'Bearer ' + logInfo},
      data: { "tracks": [{"uri": uri}]}
    })
    .then (async _ => {
      let offset=0;
      let curTracks;
      curTracks = await getPlaylist(offset, curTracks, playlists.selectedPlaylist);
      setDispPlaylist(curTracks);
      if(playlistTrack===playlists.selectedPlaylist){
        setTracks({selectedTrack: tracks.selectedTrack, listOfTracksFromApi: curTracks});
      }
    });
  }

  async function checkExistence(){
    if(!addSong){
      let offset=0;
      let curTracks=null;
      curTracks = await getPlaylist(offset, curTracks, addingId);
      for(const item of curTracks){
        if(item.track.uri===addingTrack){
          alert("Song already in the playlist")
          setAddingTrack(null)
          setAddingId(null)
        }
        else if(item===curTracks[curTracks.length-1])
          setAddSong(true);
      }
    }
    if(addSong){
      trackAdded();
    }
  }

  async function trackAdded(){
    axios(`https://api.spotify.com/v1/playlists/${addingId}/tracks`, {
      method: "POST",
      headers: {'Authorization' : 'Bearer ' + logInfo},
      data: { "uris": [addingTrack]}
    })
    .then (async _ => {
      if(addingId===playlists.selectedPlaylist){
        let offset=0;
        let curTracks;
        curTracks = await getPlaylist(offset, curTracks, addingId);
        setDispPlaylist(curTracks);
        if(playlistTrack===playlists.selectedPlaylist){
          setTracks({selectedTrack: tracks.selectedTrack, listOfTracksFromApi: curTracks});
        }
      }
      else if(playlistTrack===addingId){
        let offset=0;
        let updateTracks;
        updateTracks = await getPlaylist(offset, updateTracks, addingId);
        setTracks({selectedTrack: tracks.selectedTrack, listOfTracksFromApi: updateTracks});
      }
    })
    setAddingTrack(null)
    setAddingId(null)
    setAddSong(false);
  }
  useEffect( ()=>{
    if(addingTrack && addingId){
      checkExistence();
    }
  }, [addingTrack, addingId, addSong])

  useEffect(() => {
    if(inputRef.current){
      const handleClickInside = event=>{
        if(inputRef.current.contains(event.target) || document.activeElement.className==="AddButton"){
          setOnlineClicked(true);
        }
        else{
          setOnlineClicked(false);
        }
        if(!open && inputRef.current.contains(event.target)){
          setOpen(open);
        }
      }
      document.addEventListener("click", handleClickInside);
      return () => {
        document.removeEventListener("click", handleClickInside);
      };
    }
  }, [inputRef.current])

  return (
    <div className="App">
      {!userInfo ? <Login setLoggedIn={setLogInfo} wrong={wrong} setWrong={setWrong}/>:
      <div className="Container">
        {playlists.listOfPlaylistsFromAPI.length!==0 && <Script url="https://sdk.scdn.co/spotify-player.js"/>}
        <div className="Box1">
          <Search class="SearchPlaylist" placeh="Search playlist" setQuery={setQPlaylist}/>
          <Playlists items= {playlists.listOfPlaylistsFromAPI}  playlist={playlists.selectedPlaylist} changed = {playlistChanged}/>
          <Search class="SearchOnline" placeh="Search for a song..." setQuery={setQOnline}  inputRef={inputRef}/>
        </div>
        <div className="Box2">
          {dispPlaylist && <Songs items = {search(dispPlaylist, qPlaylist)} tracks={tracks} setTracks = {setTracks} dispPlaylist={dispPlaylist} trackDeleted={trackDeleted} query={qPlaylist} setPlaylistTrack ={setPlaylistTrack} playlists={playlists} player={player}/> }
          {tracks.selectedTrack && <Details player= {player} playing={playing} access_token={logInfo} duration={duration} tracks={tracks} setTracks={setTracks}/>}
        </div>
      </div>}
      {onlineClicked && searchRes && <Online songs={searchRes} query={qOnline} playlists = {playlists.listOfPlaylistsFromAPI} addingTrack={addingTrack} setAddingTrack={setAddingTrack}  setOnlineClicked={setOnlineClicked} setAddingId={setAddingId} userInfo={userInfo} open={open} setOpen={setOpen}/>}
    </div>
  );

}
export default App;
