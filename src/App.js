
import './App.css';

import NavigationBar from './components/NavigationBar';
import { Routes } from 'react-router-dom';
import Home from './components/Home';
import Contact from './components/Contact';
import { Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Detail from './components/Detail';
import AddStudent from './components/AddStudent';
import UpdateStudent from './components/UpdateStudent';
import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './App.css';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userInfoVisible, setUserInfoVisible] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(() => {
    if (user) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            Accept: 'application/json'
          }
        })
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
    setUserInfoVisible(false);
  };
  return (

    <div>

      <NavigationBar />

      <Routes>

        <Route path='/' element={<Home />}></Route >

        <Route path='/dashboard' element={<Dashboard />}></Route>

        <Route path='/contact' element={<Contact />}></Route>

        <Route path='/detail/:id' element={<Detail />}></Route>

        <Route path='/AddStudent' element={<AddStudent />}></Route>

        <Route path='/UpdateStudent/:id' element={<UpdateStudent />}></Route>


      </Routes>

      <div className="login-section">
        {profile ? (
          <div className="user-info">
            <Avatar
              alt="user image"
              src={profile.picture}
              onClick={() => {
                console.log('Avatar clicked');
                setUserInfoVisible(!userInfoVisible);
              }}
            />
            {userInfoVisible && (
              <Paper style={{ width: '250px', padding: '16px' }} elevation={3} className="user-info-dropdown">
                <h4 className="welcome-message">{profile.name}</h4>
                <p className="email-address">{profile.email}</p>
                <div style={{textAlign: 'right'}} className="logout-button-container">
                <button style={{
                  backgroundColor: 'black', 
                  color: 'white',
                  padding: '8px 16px', 
                  border: 'none', 
                  cursor: 'pointer' 
                }} className="logout-button" onClick={logOut}>
                  Log out
                </button></div>
              </Paper>
            )}
          </div>
        ) : (
          <div className="login-button">
            <button className="google-login-button" onClick={login}>Sign in with Google 🚀</button>
          </div>
        )}
      </div>
    </div>



  );
}

export default App;
