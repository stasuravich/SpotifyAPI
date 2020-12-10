import React from 'react';
import Search from '../Components/Search';
import {shallow} from "enzyme";
import toJson from "enzyme-to-json";

describe("rendering components", ()=> {
  it("renders Search without crashing", ()=>{
    shallow(<Search/>);
  });
})

describe("snapshots", () => {
  it("Search snapshots", () => {
    const tree= shallow(<Search/>);
    expect(toJson(tree)).toMatchSnapshot();
  });
})
