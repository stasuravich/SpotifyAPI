import React, {useState} from 'react';
import '../Css/Login.css';
import logo from '../logos/adrian-korte-5gn2soeAc40-unsplash.jpg';

const Login =props=>{

  const [token, setToken]=useState();


  const submit=e =>{
    e.preventDefault();
    if(token){
      props.setLoggedIn(token);
    }
    else{
      props.setWrong(true);
    }
  }


  return (
    <div className="Login">
      <img src={logo} alt ="Logo" className="Logo"/>
      <h1>Login</h1>
      <form onSubmit = {e => submit(e)}>
        <label className="TokenLabel">Enter spotify token below (get it from {" "}
          <a href="https://beta.developer.spotify.com/documentation/web-playback-sdk/quick-start/#authenticating-with-spotify">
            here
          </a>):
        </label>
        <br/>
        <input className="TokenInput" type="text" placeholder="spotify token" onChange={e=> setToken(e.target.value)} defaultValue =''/>
        <br/><br/>
        <button type = "submit" >Submit</button>
      </form>
      {props.wrong &&
        <div className="Wrong"> Invalid token, please try again</div>
      }
    </div>
  );
}

export default Login;
