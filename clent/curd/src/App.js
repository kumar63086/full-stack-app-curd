
import './App.css';
import { Route, Routes } from 'react-router-dom';
import UserManagement from './components/UserManagement';
import Navbar from './components/Navbar';
function App() {

  return (
    <div className="App">
     <Navbar/>
      <Routes>
        <Route path='/a' element={<UserManagement/>} />
      </Routes>
    </div>
  );
}

export default App;
