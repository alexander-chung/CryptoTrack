import './App.css';
import React, { useState, useMemo } from "react";
import {BrowserRouter,  Route} from 'react-router-dom';
import MainPage from './components/MainPage';
import CoinDetailPage from './components/CoinDetailPage'
import Portfolio from './components/Portfolio'
import { UserContext } from "./UserContext";

require('dotenv').config();

function App() {
  const [userCoins, setUserCoins] = useState([])

  const value = useMemo(() => ({ userCoins, setUserCoins }), [userCoins, setUserCoins]);

  return (
    <>
      <UserContext.Provider value={value}>
        <div className="main-app">
          <BrowserRouter>
            <Route exact path="/"
              component={MainPage}/>
            <Route path="/coins/:id"
              component={CoinDetailPage}/>
            <Route path="/portfolio"
              component={Portfolio} />
          </BrowserRouter>
        </div>
      </UserContext.Provider>
    </>
  );
}

export default App;
