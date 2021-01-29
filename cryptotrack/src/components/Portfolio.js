import React, {useState, useEffect, useContext} from 'react'
import NavBar from './NavBar';
import { useAuth0 } from '@auth0/auth0-react';
import coinGecko from '../api/coinGecko';
import Coin from './Coin';
import { UserContext } from "../UserContext";

import './MainPage.css';
import './Portfolio.css';

const Portfolio = () => {
  const { userCoins, setUserCoins } = useContext(UserContext);

  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState({"id": -1, "auth0_id": "", "coins": ""});
  const [coins, setCoins] = useState([])

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
    console.log("userData: ", userData.coins)
    if(userData.coins === "") {
      return
    }
    if(isAuthenticated) {
      const fetchData = async () => {
        const response = await coinGecko.get(`/coins/markets`, {
          params: {
            vs_currency: 'usd',
            ids: userData.coins,
            order: 'market_cap_desc',
            per_page: 50,
            sparkline: true,
            price_change_percentage: '1h,24h,7d'
          }
        });
        setCoins(response.data)
      }
      if(userData.coins === ""){
        console.log("no coins")
      } else {
        fetchData()
      }
    }
  }, [userData])

  useEffect(() => {
    console.log("coins: ", coins)
  }, [coins])

  return (
    <>
      <NavBar />
      {isAuthenticated ? 
        <div className='coin-list' style={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div className='coin-list-header' >
            <div className='coin-row'>
              <div className='coin'>
                <span className='coin-market-cap-rank' style={{cursor: 'pointer' }}>#</span>
                <h1 className='coin-name' style={{cursor: 'pointer' }}>Coin</h1>
              </div>
              <div className='coin-data' style={{justifyContent: 'normal'}}>
                <span className='coin-price' style={{cursor: 'pointer' }}>Price</span>
                <span className='coin-percent' style={{cursor: 'pointer' }}>1h</span>
                <span className='coin-percent' style={{cursor: 'pointer' }}>24h</span>
                <span className='coin-percent' style={{cursor: 'pointer' }}>7d</span>
                <span className='coin-volume' style={{cursor: 'pointer' }}>24h Volume</span>
                <span className='coin-market-cap' style={{transform: 'translate(10px, 0px)', cursor: 'pointer'}}>Mkt Cap</span>
              </div>
            </div>
          </div>
          {coins.map((coin) => (
            <Coin
                key={coin.id}
                coinId={coin.id}
                coinName={coin.name}
                coinImage={coin.image}
                coinSymbol={coin.symbol}
                coinPrice={coin.current_price}
                coinVolume={coin.total_volume}
                pricechange1h={coin.price_change_percentage_1h_in_currency}
                priceChange24h={coin.price_change_percentage_24h_in_currency}
                pricechange7d={coin.price_change_percentage_7d_in_currency}
                marketCap={coin.market_cap}
                marketCapRank={coin.market_cap_rank}
              />
          ))}
        </div> 
        :<div className='center' style={{fontSize: '16px', fontWeight: 'bold'}}>
          Please sign in to create, edit, or view your portfolio
        </div>
      }
    </>
  )
}

export default Portfolio
