import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';


export default function CoinDetails( {details}) {

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <>
    { details ?
    <div>
      <div style={{display: 'flex', justifyContent: 'center', marginBottom: '32px'}}>
        <div style={{float: 'left', width: '1000px'}}>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <img src={details.image} style={{height: '65px', width:'65px', marginLeft: '5px', marginRight: '10px'}}></img>
            <h1 style={{transform: 'translateY(10px)'}}>{details.name}</h1>
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
              <span className='info-data'>${numberWithCommas(details.market_cap)}</span>
            </div>
          </div>
          <div className='info-box'>
            <div className='info-title'>24h volume</div>
            <div>
              <span className='info-data'>${numberWithCommas(details.total_volume)}</span>
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
