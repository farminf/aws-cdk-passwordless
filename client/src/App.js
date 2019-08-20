import React , { useState , useEffect } from 'react';
import Amplify,{ Auth } from 'aws-amplify';
import generator from "generate-password";
import awsExport from './aws-exports';
import { async } from 'rxjs/internal/scheduler/async';
Amplify.configure(awsExport);

function App() {

  const [email,setEmail] = useState("");
  const [code,setCode] = useState("");
  const [session,setSession] = useState("Not loggedIn");

  

  useEffect(()=>{
    async function fetchAuth() {
      const auth = await Auth.currentSession();
      if (auth) {
        setSession(auth.getAccessToken().getJwtToken());
      }
    }
    fetchAuth();
    
  },[session]);

  const awsConfirmCode = async () => {
    const password = generator.generate({
      length: 25,
      numbers: true,
      symbols: true,
      strict: true,
    });
    try {
      await Auth.forgotPasswordSubmit(email, code, password);
      await Auth.signIn(email, password);
      setSession("logging in...");

    } catch (e) {
      console.error("Error in confirmForgotPassword: ", e);
      return false;
    }
  };

  const resetPassword = async (email) => {
    try {
      await Auth.forgotPassword(email);
    } catch (e) {
      console.error("Error in resetPassword: ", e);
      return false;
    }
  
    return true;
  };

  const awsLogin = async () => {
    const password = generator.generate({
      length: 25,
      numbers: true,
      symbols: true,
      strict: true,
    });
    try {

      const auth = await Auth.signUp({
        password,
        username: email,
        attributes:{
          name: email
        }
      });
      console.log("auth", auth);
    } catch (err){

      if (err.code && err.code === "UsernameExistsException") {
        const success = await resetPassword(email);
        console.log("success",success);
      }

      if (err.code && err.code === "UserLambdaValidationException") {
        console.log("error",err);
      }
    }
  };

  const onLogin = async (e) => {
    e.preventDefault();
    console.log("submit");
    await awsLogin();
  };

  const onConfirmCode = async (e) => {
    e.preventDefault();
    console.log("submit code");
    await awsConfirmCode();
  };

  const awsLogout = async (e) =>{
    try {
      await Auth.signOut();
      setSession("Logged Out");
    } catch (e){
      console.log("error signing out",e);
    }
  };

  return (
    <div className="App">
      <form onSubmit={onLogin} >
        <input
          name="email"
          autoFocus
          onChange={(evt)=> setEmail(evt.target.value)}
        />
        <button type="submit"> Submit </button>
      </form>
      <form onSubmit={onConfirmCode} >
        <input
          name="code"
          autoFocus
          onChange={(evt)=> setCode(evt.target.value)}
        />
        <button type="submit"> Confirm Code</button>
      </form>
      <p>{session}</p>
      <button
        type="button"
        onClick={awsLogout}
      >Logout</button>
    </div>
  );
}

export default App;
