import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate,NavLink } from "react-router-dom";
import { fetchUserDetails, logoutUser } from "../features/authSlice";
import { toast } from "react-toastify";
import CartIcon from "./CartIcon";

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Ensure correct path to `auth` state
  const authTokens = useSelector((state) => state.auth.authTokens);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);

  useEffect(() => {
    if (authTokens) {
      dispatch(fetchUserDetails());
    }
  }, [authTokens, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("User logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
      if (user) {
          if (user.is_staff) {
              setIsAdmin(true);
          } else {
              setIsBuyer(true);
          }
      }
  }, [user]);


  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light ps-5 pe-5">
      <div className="container-fluid">
        <img
          src="https://cdn-icons-png.freepik.com/256/3145/3145765.png?semt=ais_hybrid"
          alt="Books Store"
          style={{
            height: "40px",  // Adjust this to fit the navbar height
            marginRight: "10px",  // Add some space between the image and the brand name
          }}
        />
        
        <a className="navbar-brand" href="#">
          Books Store
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0" style={{ gap: "15px" }}>
            <li className="nav-item">
              <NavLink to={'/'} className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to={'/book_list'}>
                Books
              </NavLink>
            </li>
            <li className="nav-item">
              {isBuyer && <CartIcon />}
            </li>
            <li className="nav-item">
              <form className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button className="btn btn-outline-success" type="submit">
                  Search
                </button>
              </form>
            </li>

            {user && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user.is_staff ? "Hi Admin" : `Hi ${user.username}`}
                </a>
                <ul className="dropdown-menu" aria-labelledby="userDropdown">
                  <li>
                    <NavLink to={'/profile'} className="dropdown-item" href="#">
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another Action
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item">
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
    </>

  );
}

export default Navbar;
