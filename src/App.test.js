import React, {useState} from 'react';
import App from './App';
import Login from './Components/Login'
import {shallow, mount} from "enzyme";

describe("rendering components", ()=> {
  it("renders App without crashing", ()=>{
    shallow(<App/>);
  });
  it("renders Login component without crashing", ()=>{
    shallow(<Login/>);
  })
})
