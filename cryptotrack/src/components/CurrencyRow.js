import React from 'react'

const CurrencyRow = ( { currencyText, amount, onChangeAmount } ) => {
  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <span style={{border: 'solid 1px grey', background: '#252525', padding: '10px 15px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px'}}>{currencyText}</span>
      <input type='number' style={{background: '#343a40', padding: '10px', border: 'solid 1px grey'}} value={amount} onChange={onChangeAmount}></input>
    </div>
  )
}

export default CurrencyRow
