import React, {useState, useEffect} from 'react';
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
      axios('https://api.spotify.com/v1/me/playlists', {
          method: 'GET',
          headers: {'Authorization' : 'Bearer ' + logInfo}
        })
        .then((response) => {
          setPlaylists({listOfPlaylistsFromAPI: response.data.items});
        })
        .catch(_=>{
          setLogInfo(null)
          setWrong(true);
        })
      }
  }, [logInfo]);

  useEffect(()=> {
    if(qOnline){
      axios(`https://api.spotify.com/v1/search?type=track&q=${qOnline}`, {
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

  const playlistChanged = (val)=>{

    setPlaylists({selectedPlaylist: val,
                  listOfPlaylistsFromAPI: playlists.listOfPlaylistsFromAPI})
    axios(`https://api.spotify.com/v1/playlists/${val}/tracks`, {
      method: 'GET',
      headers: {'Authorization' : 'Bearer ' + logInfo}
    })
    .then (response => {
      setDispPlaylist(response.data.items);
    })};

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
            if(state.track_window.current_track.id!==tracks.selectedTrack.id){
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
              if(state.track_window.current_track.id!==tracks.selectedTrack.id){
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

  const trackDeleted = (uri) => {
    axios(`https://api.spotify.com/v1/playlists/${playlists.selectedPlaylist}/tracks`, {
      method: "DELETE",
      headers: {'Authorization' : 'Bearer ' + logInfo},
      data: { "tracks": [{"uri": uri}]}
    })
    .then (response => {
      playlistChanged(playlists.selectedPlaylist);
    });
  }

  useEffect(()=>{
    if(addingTrack && addingId){
      axios(`https://api.spotify.com/v1/playlists/${addingId}/tracks`, {
        method: 'GET',
        headers: {'Authorization' : 'Bearer ' + logInfo}
      })
      .then (response => {
        for(const item of response.data.items){
          if(item.track.uri===addingTrack){
            alert("Song already in the playlist")
            setAddingTrack(null)
            setAddingId(null)
          }
        }
        setAddSong(true)
      });
      if(addSong){
        axios(`https://api.spotify.com/v1/playlists/${addingId}/tracks`, {
          method: "POST",
          headers: {'Authorization' : 'Bearer ' + logInfo},
          data: { "uris": [addingTrack]}
        })
        .then (response => {
          if(addingId===playlists.selectedPlaylist){
            playlistChanged(addingId);
          }
        });
        setAddingTrack(null)
        setAddingId(null)
      }
    }
    setAddSong(false);
  }, [addingTrack, addingId, addSong])


  function Alerter(ref) {
    useEffect(() => {
      function handleClickInside(event){
        if(ref.current.contains(event.target) || document.activeElement.id==="AddButton"){
          setOnlineClicked(true);
        }
        else{
          setOnlineClicked(false);
        }
      }
      document.addEventListener("click", handleClickInside);
      return () => {
        document.removeEventListener("click", handleClickInside);
      };
    }, [ref]);
  }


  return (
    <div className="App">
      {!logInfo ? <Login setLoggedIn={setLogInfo} wrong={wrong} setWrong={setWrong}/>:
      <div className="Container">
        {playlists.listOfPlaylistsFromAPI.length!==0 && <Script url="https://sdk.scdn.co/spotify-player.js"/>}
        <div className="Box1">
          <Search class="SearchPlaylist" placeh="Search playlist" setQuery={setQPlaylist} alerter = {() => {}}/>
          <Playlists items= {playlists.listOfPlaylistsFromAPI}  playlist={playlists.selectedPlaylist} changed = {playlistChanged}/>
          <Search class="SearchOnline" placeh="Search online" setQuery={setQOnline} alerter = {Alerter}/>

        </div>
        <div className="Box2">
          {dispPlaylist && <Songs items = {search(dispPlaylist, qPlaylist)} setTracks = {setTracks} tracks={dispPlaylist} trackDeleted={trackDeleted} query={qPlaylist} setPlaylistTrack ={setPlaylistTrack} playlists={playlists}/> }
          {tracks.selectedTrack && <Details player= {player} playing={playing} access_token={logInfo} duration={duration} tracks={tracks} setTracks={setTracks}/>}
        </div>
      </div>}

      {onlineClicked && searchRes && <Online songs={searchRes} query={qOnline} playlists = {playlists.listOfPlaylistsFromAPI}
        setAddingTrack={setAddingTrack}  setOnlineClicked={setOnlineClicked} setAddingId={setAddingId}/>}
    </div>
  );

}
export default App;
