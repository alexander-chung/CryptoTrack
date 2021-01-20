import React, {useState, useEffect} from 'react'
import CurrencyRow from './CurrencyRow'
import SyncAltIcon from '@material-ui/icons/SyncAlt';

const CurrencyConverter = ({ details }) => {
  const [exchangeRate, setExchangeRate] = useState(1)
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
    setExchangeRate(details.current_price)
  }, [])

  const handleFromAmountChange = (e) => {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  const handleToAmountChange = (e) => {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <div style={{display: 'flex', flexDirection: 'row', height: '65px', alignItems:'center'}}>
      <CurrencyRow 
        currencyText={details.symbol.toUpperCase()}
        amount={fromAmount}
        onChangeAmount={handleFromAmountChange}
      />
      <div style={{marginLeft: '5px', marginRight: '5px'}}><SyncAltIcon/></div> 
      <CurrencyRow
        currencyText={'USD'}
        amount={toAmount}
        onChangeAmount={handleToAmountChange}
      />
    </div>
  )
}

export default CurrencyConverter
