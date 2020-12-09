import React, {useState} from 'react';
import App from './App';
import Login from './Components/Login'
import {shallow, mount} from "enzyme";

// const [cred, setCred]=useState("wrong");
// const [qPlaylist, setQPlaylist]=useState("t");
// const [loggedIn, setLoggedIn]=useState("wofubnoubnveo");

describe("rendering components", ()=> {
  it("renders App without crashing", ()=>{
    shallow(<App/>);
  });
  it("renders Login component without crashing", ()=>{
    shallow(<Login/>);
  })
})

// describe("passing props", ()=>{
//   const loginWrapper=mount(<Login setLoggedIn={setLoggedIn} cred={cred} setCred={setCred}/>);
//   const searchWrapper=mount(<Search class="SearchPlaylist" placeh="Search playlist" setQuery={setQPlaylist}/>);
// })
