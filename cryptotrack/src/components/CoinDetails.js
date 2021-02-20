import React, { useState, useEffect,useContext, useRef } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import CurrencyConverter from './CurrencyConverter';
import Button from '@material-ui/core/Button';
import { useAuth0 } from '@auth0/auth0-react';
import { UserContext } from "../UserContext";


import { makeStyles } from "@material-ui/core/styles";


export default function CoinDetails( {details}) {
  const { userCoins, setUserCoins } = useContext(UserContext)
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState({})
  
  useEffect(() => {
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
          .then(setUserData({"id": null, "auth0_id": user.sub, "coins": ""})
            .then(setUserCoins([])))
        }else {
          setUserData(data[0])
          if(data[0].coins === ""){
            setUserCoins([])
          }else{
            setUserCoins(data[0].coins.split(","))
          }
        }
      })
    }
  }, [])

  useEffect(() => {
    const updateCoins = async () => {
      const response = await fetch('http://localhost:5000/updateCoins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"id": userData.id, "auth0_id": "", "coins": userCoins.join(",")})
      })
      const data = await response.json();
      return data;
    }
    updateCoins()
  }, [userCoins])

  const addCoin = (e) => {
    setUserCoins(userCoins.concat([details.id]))
  }

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const fnum = (x) => {
    if(isNaN(x)) return x;
  
    if(x < 9999) {
      return x;
    }
  
    if(x < 1000000) {
      return Math.round(x/1000) + "K";
    }
    if( x < 10000000) {
      return (x/1000000).toFixed(2) + "M";
    }
  
    if(x < 1000000000) {
      return Math.round((x/1000000)) + "M";
    }
  
    if(x < 1000000000000) {
      return Math.round((x/1000000000)) + "B";
    }
  
    return "1T+";
  }

  const useStyles = makeStyles(theme => ({
    root: {
      height: "40px",
    },
  }));

  const classes = useStyles()

  return (
    <>
    { details ?
    <div>
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: '32px'}}>
        <div style={{float: 'left', width: '1000px'}}>
          <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <img src={details.image} style={{height: '65px', width:'65px', marginLeft: '5px', marginRight: '10px'}}></img>
              <h1 style={{transform: 'translateY(10px)'}}>{details.name}</h1>
            </div>
            { userCoins.indexOf(details.id) > -1 ?
            <Button classes={classes} variant="contained" title="Sign in to edit your portfolio" color="primary" disabled={isAuthenticated ? false : true} disabled={true}>Added to portfolio &#9989;</Button>
            :  <Button classes={classes} variant="contained" color="primary" disabled={isAuthenticated ? false : true} onClick={addCoin}>Add to my portfolio</Button>
            }       
            <CurrencyConverter details={details}/>
          </div>
        </div>
      </div>
      <div className='chart-info-container'>
        <div className='chart-info'>
          <div className='info-box'>
            <div className='info-title'>Price</div>
            <div>
              <span className='info-data'>${(numberWithCommas(details.current_price.toFixed(2)))}</span>
            </div>
          </div>
          <div className='info-box'>
            <div className='info-title'>1 hour</div>
            <div>
              <span className='info-data' style={{color: details.price_change_percentage_1h_in_currency < 0 ? ' #F4282D' : '#33C15D'}}>{parseFloat(details.price_change_percentage_1h_in_currency).toFixed(2)}%</span>
            </div>
          </div>
          <div className='info-box'>
            <div className='info-title'>1 day</div>
            <div>
              <span className='info-data' style={{color: details.price_change_percentage_24h_in_currency < 0 ? ' #F4282D' : '#33C15D'}}>{parseFloat(details.price_change_percentage_24h_in_currency).toFixed(2)}%</span>
            </div>
          </div>
          <div className='info-box'>
            <div className='info-title'>1 week</div>
            <div>
              <span className='info-data' style={{color: details.price_change_percentage_7d_in_currency < 0 ? ' #F4282D' : '#33C15D'}}>{parseFloat(details.price_change_percentage_7d_in_currency).toFixed(2)}%</span>
            </div>
          </div>
          <div className='info-box'>
            <div className='info-title'>Market Cap</div>
            <div>
              <span className='info-data'>${fnum(details.market_cap)}</span>
            </div>
          </div>
          <div className='info-box'>
            <div className='info-title'>24h volume</div>
            <div>
              <span className='info-data'>${fnum(details.total_volume)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    : 
    <CircularProgress className='loading-bar' color="secondary" />
    }
    </>
  )
}
