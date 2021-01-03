import React, {useState, useEffect} from 'react';
import './MainPage.css';
import axios from 'axios';
import Coin from './Coin';


export default function MainPage({}) {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  
  const coinsURL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d'
  
  useEffect(() => {
    axios.get(coinsURL)
    .then(res => {
      setCoins(res.data)
    })
    .catch(err => console.log(err));
  }, [])

  useEffect(() => console.log(search), [search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const filteredCoins = coins.filter(coin => coin.name.toLowerCase().includes(search.toLowerCase()))
  
  return (
    <div className='coin-app'>
      <h1 className='page-header'>Crypto Tracker</h1>
      <div className='search-row'>
        <div> </div>
        <div className='search-bar'>
          <form>
            <input 
              type='text'
              placeholder='Search'
              className='search-input'
              onChange={handleSearchChange}
            />
          </form> 
        </div>
      </div>
      <div className='coin-list'>
        {filteredCoins.map((coin) => (
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
    </div>
  )
}
