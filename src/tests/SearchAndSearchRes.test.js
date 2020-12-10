import React from 'react';
import SearchAndSearchRes from '../Components/SearchAndSearchRes';
import Search from '../Components/Search';
import Online from '../Components/Online';
import {shallow, mount} from "enzyme";
import toJson from "enzyme-to-json";

const searchClass="SearchOnline";
const tracks = {selectedTrack: "Latency", listOfTracksFromApi: ["Latency", "Remember", "Error 404"]};

describe("rendering components", ()=> {
  it("renders SearchRes without crashing", ()=>{
    shallow(<SearchAndSearchRes/>);
  });
})

describe("passing props", ()=>{
  const onlineWrapper=mount(<Online tracks={tracks} />);
  const searchWrapper=mount(<Search class={searchClass}/>);
  it("accepts Online props", () => {
    expect(onlineWrapper.props().tracks).toEqual(tracks);
  })
  it("accepts Search prop", ()=>{
    expect(searchWrapper.props().class).toEqual(searchClass);
  })
})

describe("snapshots", () => {
  it("SearchRes snapshots", () => {
    const tree= shallow(<SearchAndSearchRes/>);
    expect(toJson(tree)).toMatchSnapshot();
  });
})
