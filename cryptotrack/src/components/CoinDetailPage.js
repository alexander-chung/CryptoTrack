import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom';
import CoinChart from './CoinChart';
import CoinDetails from './CoinDetails';
import coinGecko from '../api/coinGecko';
import NavBar from './NavBar';


export default function CoinDetailPage() {
  const { id } = useParams()
  const [coinData, setCoinData] = useState({})
  
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
      const [ history1d, history7d, history30d, details ] = await Promise.all([
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
        coinGecko.get(`/coins/markets/`, {
          params: {
            vs_currency: 'usd',
            ids: id
          }
        })
      ]);
      
      setCoinData({
        day: formatData(history1d.data.prices), 
        week: formatData(history7d.data.prices), 
        month: formatData(history30d.data.prices),
        details: details.data[0]})
    }
    fetchData()
    
  }, []);

  return (
    <div>
      <NavBar />
      <CoinChart id={id} coinData={coinData}/>
      <CoinDetails />
    </div>
  )
}
