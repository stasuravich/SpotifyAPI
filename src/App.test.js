import React, {createRef} from 'react';
import App from './App';
import Login from './Components/Login';
import Search from './Components/Search';
import SearchAndSearchRes from './Components/SearchAndSearchRes';
//import Playlists from './Components/Playlists';
import {shallow, mount} from "enzyme";
import toJson from "enzyme-to-json";

const credWrong="wrong";
const playlistClass="SearchPlaylist";
const logInfo="token";
//const playlists=createRef({selectedPlaylist:'EDM', listOfPlaylistsFromAPI: [{"EDM"}, {"Country"}, {"Pop"}]});

describe("rendering components", ()=> {
  it("renders App without crashing", ()=>{
    shallow(<App/>);
  });
  it("renders Login component without crashing", ()=>{
    shallow(<Login/>);
  })
})

describe("passing props", ()=>{
  const loginWrapper=mount(<Login cred={credWrong} />);
  const searchWrapper=mount(<Search class={playlistClass}/>);
  const searchResWrapper=mount(<SearchAndSearchRes logInfo={logInfo}/>)
  //const playlistsWrapper=mount(<Playlists playlists={playlists}/>)
  it("accepts Login props", () => {
    expect(loginWrapper.props().cred).toEqual(credWrong);
  })
  it("notification contains correct value", ()=>{
    const value=loginWrapper.find(".Wrong").text();
    const expectdeValue="Invalid token, please try again";
    expect(value).toEqual(expectdeValue);
  })
  it("accepts Search prop", ()=>{
    expect(searchWrapper.props().class).toEqual(playlistClass);
  })
  it("accepts SearchRes prop", ()=>{
    expect(searchResWrapper.props().logInfo).toEqual(logInfo);
  })
})

describe("snapshots", () => {
  it("App snapshots", () => {
    const tree= shallow(<App/>);
    expect(toJson(tree)).toMatchSnapshot();
  });
})
