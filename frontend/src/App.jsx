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
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import CheckOut from './pages/CheckOut';
import Profile from './pages/Profile';
import SearchResults from './components/SearchResult';


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
        <Route path="/book_details/:bookId" element={<BookDetails />} />
        <Route path='/add_book' element={ <AddBook/> } />
        <Route path="/edit_book/:bookId" element={<AddBook />} />
        <Route path="/cart/" element={<Cart />} />
        <Route path="/checkout/" element={<CheckOut />} />
        <Route path="/profile/" element={<Profile />} />
        <Route path="/search" element={<SearchResults />} />
        
        <Route path='/add_genre' element={ <AddGenre/> } />
        

      </Routes>
    </Router>
    <ToastContainer />

    </>
  )
}

export default App
