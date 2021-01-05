import React, {useState, useEffect} from 'react';
import Coin from './Coin';
import './MainPage.css';
import coinGecko from '../api/coinGecko';
import CircularProgress from '@material-ui/core/CircularProgress';


export default function MainPage({}) {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await coinGecko.get(`/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          // per_page: 100,
          // page: 1,
          sparkline: true,
          price_change_percentage: '1h,24h,7d'
        }
      });
      setCoins(res.data)
      setLoading(false)
    }
    fetchData()
  }, []);

  useEffect(() => {
    console.log("coins are changed")
  }, [coins])

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const sortByRank = (e) => {
    const updateCoins = coins.sort((a,b) => (a.market_cap_rank > b.market_cap_rank) ? -1 : 1);
    setCoins([...updateCoins])
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
        <div className='coin-list-header' >
          <div className='coin-row'>
            <div className='coin'>
              <span className='coin-market-cap-rank' onClick={sortByRank}>#</span>
              <h1 className='coin-name'>Coin</h1>
              <span className='coin-symbol'> </span>
            </div>
            <div className='coin-data' style={{justifyContent: 'normal'}}>
              <span className='coin-price'>Price</span>
              <span className='coin-percent'>1h</span>
              <span className='coin-percent'>24h</span>
              <span className='coin-percent'>7d</span>
              <span className='coin-volume'>24h Volume</span>
              <span className='coin-market-cap' style={{transform: 'translate(20px, 0px)'}}>Mkt Cap</span>
            </div>
          </div>
        </div>
        {loading ? 
          <CircularProgress color="secondary" />
        : filteredCoins.map((coin) => (
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
        ))
        }
      </div>
    </div>
  )
}
