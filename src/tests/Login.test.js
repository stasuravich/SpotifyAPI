import React from 'react';
import Login from '../Components/Login';
import {shallow} from "enzyme";

describe("rendering components", ()=> {
  it("renders App without crashing", ()=>{
    shallow(<Login/>);
  });
  it("renders App component header without crashing", ()=>{
    const wrapper = shallow(<Login/>);
    const header=(<h1>Login</h1>);
    expect(wrapper.contains(header)).toEqual(true);
  })
  it("renders button", ()=>{
    const wrapper = shallow(<Login/>);
    const label=wrapper.find("#submit-button").text();
    expect(label).toEqual("Submit");
  })
})
