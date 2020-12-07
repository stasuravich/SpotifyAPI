import React, {memo, useCallback} from 'react';
import '../Css/Search.css';

const Search = memo(props=>{
  const loadQuery=useCallback(e=>{
    if(e.target.placeholder==="Search for a song..."){
      props.changeSearchRes(e.target.value);
    }
    else{
      props.setQuery(e.target.value);
    }
  }, [props.changeSearchRes, props.setQuery]);

  return(
    <div className= {props.class} >
      <input ref = {props.inputRef} type="text" placeholder = {props.placeh} onChange={loadQuery}></input>
    </div>
  )
})

export default Search;
