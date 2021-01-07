
import './App.css';
import {BrowserRouter, Route} from 'react-router-dom';
import MainPage from './components/MainPage';
import CoinDetailPage from './components/CoinDetailPage'

function App() {
  
  return (
    <div className="main-app">
      <BrowserRouter> 
        <Route exact path="/" component={MainPage} />
        <Route path="/coins/:id" component={CoinDetailPage} />
      </BrowserRouter>

     
    </div>
  );
}

export default App;
