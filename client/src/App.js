
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import SignUpPage from './components/Signup';
import LoginPage from './components/Login';
import Dashboard from './components/Dashboard';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path ='/signup' element={<SignUpPage/>}/>
    <Route path='/signin' element={<LoginPage/>}/>
    <Route path='/' element={<Dashboard/>}/>
    </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
