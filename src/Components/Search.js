import React, {memo} from 'react';
import '../Css/Search.css';

const Search = memo(function Search(props){
  console.log(props.class);

  return(
    <div className= {props.class} >
      <input ref = {props.inputRef} type="text" placeholder = {props.placeh} onChange={(e) => props.setQuery(e.target.value)}></input>
    </div>
  )
})

export default Search;
