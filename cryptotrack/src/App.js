import './App.css';
import {BrowserRouter,  Route} from 'react-router-dom';
import MainPage from './components/MainPage';
import CoinDetailPage from './components/CoinDetailPage'
import Portfolio from './components/Portfolio'
require('dotenv').config();

function App() {

  return (
    <>
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
    </>
  );
}

export default App;
