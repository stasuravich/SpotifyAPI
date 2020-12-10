import React from 'react';
import Login from '../Components/Login';
import {shallow} from "enzyme";
import toJson from "enzyme-to-json";

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

describe("snapshots", () => {
  it("Login snapshots", () => {
    const tree= shallow(<Login/>);
    expect(toJson(tree)).toMatchSnapshot();
  });
})
