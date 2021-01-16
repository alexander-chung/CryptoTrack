import React, {useState, useEffect} from 'react'
import './MainPage.css';
import './Coin.css'
import { useHistory } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '@material-ui/core/Button';

const NavBar = () => {
  const { user, isAuthenticated } = useAuth0();

  const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
    
    const asyncLogin = async () => {
      await loginWithRedirect();
    }

    return (
      <Button variant="contained" color="primary" className='login-button' onClick={asyncLogin}>
        Log in
      </Button>
    )
  }

  const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
      <Button variant="contained" color="primary" className='logout-button' onClick={() => logout()}>
        Log out
      </Button>
    )
  }

  const history = useHistory();

  const returnToHome = () => {
    history.push("/")
    window.location.reload()
  }

  return (
    <div className='nav-container' style={{display: 'flex', justifyContent: 'center'}}>
      <div className='nav-bar-first'>
        <div className='page-header' style={{cursor: 'pointer'}}onClick={returnToHome}>CryptoTracker</div>
        {isAuthenticated ? 
          <div className="user-greetings">
            <img src={user.picture} alt={user.name} style={{height: '35px', width: '35px', marginRight: '10px'}}/>
            <LogoutButton />
          </div>
          : <LoginButton />
        }
      </div>
    </div>
  )
}

export default NavBar
