import React, {useState, useEffect, useContext} from 'react'
import coinGecko from '../api/coinGecko';
import { Link, useHistory } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { UserContext } from "../UserContext";


import './MainPage.css';
import './Coin.css'
import './NavBar.css'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { makeStyles } from "@material-ui/core/styles";

const NavBar = () => {
  const { userCoins, setUserCoins } = useContext(UserContext);
  const { user, isAuthenticated } = useAuth0();
  const [searchData, setSearchData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const [ searchData ] = await Promise.all([
        coinGecko.get(`/coins/list`)]);
      setSearchData(searchData.data.sort(() => Math.random() - 0.5))
    }
    fetchData()
    if(isAuthenticated) {
      const fetchUser = async () => {
        const response = await fetch(`http://localhost:5000/getUserData/${user.sub}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json();
        return data;
      }

      const addUser = async () => {
        const response = await fetch(`http://localhost:5000/addNewUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"id": null, "auth0_id": user.sub, "coins": ""})
        })
        const data = await response.json();
        return data
      }
      fetchUser()
      .then(data => {
        console.log(data[0])
        if(data.length === 0){
          console.log("yep new user alert")
          addUser()
            .then(setUserCoins([]))
        }else {
          if(data[0].coins === ""){
            setUserCoins([])
          }else{
            setUserCoins(data[0].coins.split(","))
          }
        }
      })
      .catch(err => console.log(err))
    }
  }, [])

  const LoginButton = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    
    const asyncLogin = async () => {
      await loginWithRedirect();
    }

    return (
      !isAuthenticated && (
      <Button variant="contained" color="primary" className='login-button' onClick={asyncLogin}>
        Log in
      </Button>)
    )
  }

  const LogoutButton = () => {
    const { logout , isAuthenticated} = useAuth0();

    return (
      isAuthenticated && (
      <Button variant="contained" color="primary" className='logout-button' onClick={() => logout()}>
        Log out
      </Button>)
    )
  }

  const history = useHistory();

  const returnToHome = () => {
    history.push("/")
    window.location.reload()
  }

  const useStyles = makeStyles(theme => ({
    root: {
      color: "pink",
      ".MuiInputLabel-outlined": {
      }
    },
    inputRoot: {
      color: "white",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "grey"
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "white"
      },
      width: "245px",
    },
    option: {
      color: "black"
    }
  }));

  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    limit: 1000
  });

  const searchSelect = (e, value) => {
    history.push(`/coins/${value.id}`);
    window.location.reload()
  }

  const classes = useStyles()

  return (
    <div style={{marginTop: '16px', marginBottom: '16px'}}>
      <div className='nav-container'>
        <div className='nav-bar-first'>
          <div></div>
          {user ? 
            <div className="user-greetings">
              <img src={user.picture} alt={user.name} style={{height: '35px', width: '35px', marginRight: '10px'}}/>
              <LogoutButton />
            </div>
            : <LoginButton />
          }
        </div>
      </div>
      <div className='nav-container' style={{display: 'flex', justifyContent: 'center', borderTop: 'solid 1px grey', borderBottom: 'solid 1px grey'}}>
        <div className='nav-bar-first'>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div className='page-header' style={{cursor: 'pointer'}}onClick={returnToHome}>CryptoTrack</div>
            <div className='link-bar'>
              <Link to={"/"} className='home-link'>Home</Link>
              <Link to={"/portfolio"} className='portfolio-link'>My Portfolio</Link>
            </div>
          </div>
          <Autocomplete
            freeSolo
            classes={classes}
            filterOptions={filterOptions}
            options={searchData}
            getOptionLabel={(option) => option.name}
            // style={{ height: 300 }}
            onChange={(e, value) => searchSelect(e,value)}
            renderInput={(params) => <TextField {...params} InputLabelProps={{style: { color: "white", fontSize: "15px"}}} label="Search" variant="outlined"/>}
          />
        </div>
      </div>
    </div>
  )
}

export default NavBar
