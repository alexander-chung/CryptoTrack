import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom';
import CoinChart from './CoinChart';
import CoinDetails from './CoinDetails';
import coinGecko from '../api/coinGecko';
import NavBar from './NavBar';
import CircularProgress from '@material-ui/core/CircularProgress';



export default function CoinDetailPage() {
  const { id } = useParams()
  const [coinData, setCoinData] = useState({})
  const [loading, setLoading] = useState(false);

  
  const formatData = data => {
    return data.map(price => {
      return {
        t: price[0],
        y: price[1].toFixed(7)
      }
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const [ history1d, history7d, history30d, historyYear, details ] = await Promise.all([
        coinGecko.get(`/coins/${id}/market_chart/`, {
          params: {
            vs_currency: 'usd',
            days: '1'
          }
        }),
        coinGecko.get(`/coins/${id}/market_chart/`, {
          params: {
            vs_currency: 'usd',
            days: '7'
          }
        }),
        coinGecko.get(`/coins/${id}/market_chart/`, {
          params: {
            vs_currency: 'usd',
            days: '30'
          }
        }),
        coinGecko.get(`/coins/${id}/market_chart/`, {
          params: {
            vs_currency: 'usd',
            days: '365'
          }
        }),
        coinGecko.get(`/coins/markets/`, {
          params: {
            vs_currency: 'usd',
            ids: id,
            price_change_percentage: '1h,24h,7d'
          }
        })
      ]);
    setCoinData({
      day: formatData(history1d.data.prices), 
      week: formatData(history7d.data.prices), 
      month: formatData(history30d.data.prices),
      year: formatData(historyYear.data.prices),
      details: details.data[0]
    })
    setLoading(false)
    }
    fetchData()
  }, []);

  return (
    <div>
      <NavBar />
      {loading ? 
        <CircularProgress className='loading-bar' color="secondary" />
      :
        <div>
          <CoinDetails details={coinData.details}/>
          <CoinChart id={id} coinData={coinData}/>  
        </div>
      }
    </div>
  )
}
