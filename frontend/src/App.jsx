import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import AuthListener from './components/Auth/AuthListener';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import AddGenre from './components/AddGenre';


function App() {
  
  return (
    <>
    <Router>
      <AuthListener/>
      <Navbar/>
      <Routes>
        <Route path='/' element={ <Home/> } />
        <Route path='/login' element={ <Login/> } />
        <Route path='/register' element={ <Register/> } />
        <Route path='/book_list' element={ <BookList/> } />
        <Route path='/add_book' element={ <AddBook/> } />
        <Route path='/add_genre' element={ <AddGenre/> } />
        

      </Routes>
    </Router>
    <ToastContainer />

    </>
  )
}

export default App
