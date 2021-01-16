import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import NavBar from './NavBar';
import Coin from './Coin';
import coinGecko from '../api/coinGecko';

import './MainPage.css';
import './Coin.css'

import { useAuth0 } from '@auth0/auth0-react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { makeStyles } from "@material-ui/core/styles";

export default function MainPage({}) {
  const [coins, setCoins] = useState([]);
  const [searchData, setSearchData] = useState([])
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortRankAscending, setSortRankAscending] = useState(true);
  const [sortNameAscending, setSortNameAscending] = useState(true);
  const [sortPriceAscending, setSortPriceAscending] = useState(true);
  const [sortHourAscending, setSortHourAscending] = useState(true);
  const [sortDayAscending, setSortDayAscending] = useState(true);
  const [sortWeekAscending, setSortWeekAscending] = useState(true);
  const [sortVolumeAscending, setSortVolumeAscending] = useState(true);
  const [sortMarketCapAscending, setSortMarketCapAscending] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [ mainData, searchData ] = await Promise.all([
        coinGecko.get(`/coins/markets`, {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 50,
            page: pageNumber,
            sparkline: true,
            price_change_percentage: '1h,24h,7d'
          }
        }),
        coinGecko.get(`/coins/list`)]);
      setCoins(mainData.data)
      setSearchData(searchData.data.sort(() => Math.random() - 0.5))
      setLoading(false)
    }
    fetchData()
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await coinGecko.get(`/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 50,
          page: pageNumber,
          sparkline: true,
          price_change_percentage: '1h,24h,7d'
        }
      });
      setCoins(res.data)
      setLoading(false)
    }
    fetchData()
  }, [pageNumber])

  // const handleSearchChange = (e) => {
  //   console.log(e.target.value)
  //   if(e.target.value == null || typeof e.target.value !== 'string'){
  //     setSearch("")
  //   }else{
  //     setSearch(e.target.value)
  //   }
  // }

  const sortByRank = (e) => {
    let updateCoins;
    if(sortRankAscending) {
      updateCoins = coins.sort((a,b) => (a.market_cap_rank > b.market_cap_rank) ? -1 : 1);
    }else{
      updateCoins = coins.sort((a,b) => (a.market_cap_rank > b.market_cap_rank) ? 1 : -1);
    }
    setSortRankAscending(!sortRankAscending)
    setCoins([...updateCoins])
  }

  const sortByName = (e) => {
    let updateCoins;
    if(sortNameAscending) {
      updateCoins = coins.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? -1 : 1);
    }else{
      updateCoins = coins.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
    }
    setSortNameAscending(!sortNameAscending)
    setCoins([...updateCoins])
  }

  const sortByPrice = (e) => {
    let updateCoins;
    if(sortPriceAscending) {
      updateCoins = coins.sort((a,b) => (a.current_price > b.current_price) ? -1 : 1);
    }else{
      updateCoins = coins.sort((a,b) => (a.current_price > b.current_price) ? 1 : -1);
    }
    setSortPriceAscending(!sortPriceAscending)
    setCoins([...updateCoins])
  }

  const sortByHour = (e) => {
    let updateCoins;
    if(sortHourAscending) {
      updateCoins = coins.sort((a,b) => (a.price_change_percentage_1h_in_currency > b.price_change_percentage_1h_in_currency) ? -1 : 1);
    }else{
      updateCoins = coins.sort((a,b) => (a.price_change_percentage_1h_in_currency > b.price_change_percentage_1h_in_currency) ? 1 : -1);
    }
    setSortHourAscending(!sortHourAscending)
    setCoins([...updateCoins])
  }

  const sortByDay = (e) => {
    let updateCoins;
    if(sortDayAscending) {
      updateCoins = coins.sort((a,b) => (a.price_change_percentage_24h_in_currency > b.price_change_percentage_24h_in_currency) ? -1 : 1);
    }else{
      updateCoins = coins.sort((a,b) => (a.price_change_percentage_24h_in_currency > b.price_change_percentage_24h_in_currency) ? 1 : -1);
    }
    setSortDayAscending(!sortDayAscending)
    setCoins([...updateCoins])
  }

  const sortByWeek = (e) => {
    let updateCoins;
    if(sortWeekAscending) {
      updateCoins = coins.sort((a,b) => (a.price_change_percentage_7d_in_currency > b.price_change_percentage_7d_in_currency) ? -1 : 1);
    }else{
      updateCoins = coins.sort((a,b) => (a.price_change_percentage_7d_in_currency > b.price_change_percentage_7d_in_currency) ? 1 : -1);
    }
    setSortWeekAscending(!sortWeekAscending)
    setCoins([...updateCoins])
  }

  const sortByVolume = (e) => {
    let updateCoins;
    if(sortVolumeAscending) {
      updateCoins = coins.sort((a,b) => (a.total_volume > b.total_volume) ? -1 : 1);
    }else{
      updateCoins = coins.sort((a,b) => (a.total_volume > b.total_volume) ? 1 : -1);
    }
    setSortVolumeAscending(!sortVolumeAscending)
    setCoins([...updateCoins])
  }

  const sortByMarketCap = (e) => {
    let updateCoins;
    if(sortMarketCapAscending) {
      updateCoins = coins.sort((a,b) => (a.market_cap > b.market_cap) ? -1 : 1);
    }else{
      updateCoins = coins.sort((a,b) => (a.market_cap > b.market_cap) ? 1 : -1);
    }
    setSortMarketCapAscending(!sortMarketCapAscending)
    setCoins([...updateCoins])
  }

  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    limit: 1000
  });

  const filteredCoins = coins.filter(coin => coin.name.toLowerCase().includes(search.toLowerCase()))  

  const searchSelect = (e, value) => {
    history.push(`/coins/${value.id}`)
  }

  const history = useHistory();

  const { user, isAuthenticated } = useAuth0();

  const useStyles = makeStyles(theme => ({
    root: {
      color: "pink"
    },
    inputRoot: {
      color: "white",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "grey"
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "white"
      },
    },
    option: {
      color: "black"
    }
  }));

  const classes = useStyles()

  return (
    <>
      <NavBar />
      <div className='coin-app'>
        <div className='nav-bar-second'>
          <div className='pagination-button'>
            <ButtonGroup color="primary" aria-label="outlined primary button group">
              <Button disabled={pageNumber=== 1 ? true : false} onClick={() => setPageNumber(pageNumber - 1)}><NavigateBeforeIcon/></Button>
              <Button onClick={() => setPageNumber(pageNumber + 1)}><NavigateNextIcon/></Button>
            </ButtonGroup>
          </div>
          <Autocomplete
            freeSolo
            classes={classes}
            filterOptions={filterOptions}
            options={searchData}
            getOptionLabel={(option) => option.name}
            style={{ width: 300 }}
            onChange={(e, value) => searchSelect(e,value)}
            renderInput={(params) => <TextField {...params} InputLabelProps={{style: { color: "white"}}} label="Search" variant="outlined"/>}
          />
        </div>
        <div className='coin-list'>
          <div className='coin-list-header' >
            <div className='coin-row'>
              <div className='coin'>
                <span className='coin-market-cap-rank' onClick={sortByRank} style={{cursor: 'pointer' }}>#</span>
                <h1 className='coin-name' onClick={sortByName} style={{cursor: 'pointer' }}>Coin</h1>
              </div>
              <div className='coin-data' style={{justifyContent: 'normal'}}>
                <span className='coin-price' onClick={sortByPrice} style={{cursor: 'pointer' }}>Price</span>
                <span className='coin-percent' onClick={sortByHour} style={{cursor: 'pointer' }}>1h</span>
                <span className='coin-percent' onClick={sortByDay} style={{cursor: 'pointer' }}>24h</span>
                <span className='coin-percent' onClick={sortByWeek} style={{cursor: 'pointer' }}>7d</span>
                <span className='coin-volume' onClick={sortByVolume} style={{cursor: 'pointer' }}>24h Volume</span>
                <span className='coin-market-cap' style={{transform: 'translate(10px, 0px)', cursor: 'pointer'}} onClick={sortByMarketCap} >Mkt Cap</span>
              </div>
            </div>
          </div>
          {loading ? 
            <CircularProgress className='loading-bar' color="secondary" />
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
    </>
  )
}
