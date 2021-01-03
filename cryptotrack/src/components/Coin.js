import React from 'react'
import { Link } from 'react-router-dom';
import './Coin.css'

function Coin({coinId, coinName, coinImage, coinSymbol, coinPrice, coinVolume, pricechange1h, priceChange24h, pricechange7d,marketCap, marketCapRank}) {

  return (
    <Link to={`/coins/${coinId}`} style={{ textDecoration: 'none' }} className='coin-container'>
      <div className='coin-row'>
        <div className='coin'>
          <span className='coin-market-cap-rank'>{marketCapRank} </span>
          <img src={coinImage} alt='crypto' />
          <h1 className='coin-name'>{coinName}</h1>
          <span className='coin-symbol'>{coinSymbol} </span>
        </div>
        <div className='coin-data'>
          <span className='coin-price'>${coinPrice}</span>
          {pricechange1h < 0 ? (
            <span className='coin-percent red'>{parseFloat(pricechange1h).toFixed(2)}%</span>
            )
            : (<span className='coin-percent green'>{parseFloat(pricechange1h).toFixed(2)}%</span>
            )}
          {priceChange24h < 0 ? (
            <span className='coin-percent red'>{parseFloat(priceChange24h).toFixed(2)}%</span>
            )
            : (<span className='coin-percent green'>{parseFloat(priceChange24h).toFixed(2)}%</span>
            )}
          {pricechange7d < 0 ? (
            <span className='coin-percent red'>{parseFloat(pricechange7d).toFixed(2)}%</span>
            )
            : (<span className='coin-percent green'>{parseFloat(pricechange7d).toFixed(2)}%</span>
            )}
          <span className='coin-volume'>${coinVolume.toLocaleString()}</span>
          <span className='coin-market-cap'>${marketCap.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  )
}

export default Coin
