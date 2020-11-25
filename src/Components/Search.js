import React, {useRef} from 'react';
import '../Css/Search.css';

const Search = props => {
  const inputRef = useRef();
  props.alerter(inputRef);
  return(
    <div className= {props.class} >
      <input ref = {inputRef} type="text" placeholder = {props.placeh} onChange={(e) => props.setQuery(e.target.value)}></input>
    </div>
  )
}

export default Search;
