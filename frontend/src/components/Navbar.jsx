import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { fetchUserDetails, logoutUser } from "../features/authSlice";
import { toast } from "react-toastify";
import CartIcon from "./CartIcon";
import SearchForm from "./SearchForm";

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
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
    setIsAdmin(false);
    setIsBuyer(false);
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setIsAdmin(user.is_staff);
      setIsBuyer(!user.is_staff);
    } else {
      setIsAdmin(false);
      setIsBuyer(false);
    }
  }, [user]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top py-3">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand d-flex align-items-center gap-2">
          <img
            src="https://cdn-icons-png.freepik.com/256/3145/3145765.png?semt=ais_hybrid"
            alt="Books Store"
            style={{ height: "40px" }}
          />
          <span className="fw-bold fs-4">Books Store</span>
        </NavLink>

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
          <ul className="navbar-nav ms-auto align-items-lg-center gap-3">
            <li className="nav-item">
              <NavLink to="/" className="nav-link text-light fw-semibold">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/book_list" className="nav-link text-light fw-semibold">
                Books
              </NavLink>
            </li>
            {isBuyer && (
              <li className="nav-item">
                <CartIcon />
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <NavLink to="/add_book/" className="btn btn-outline-light btn-sm">
                  + Add Book
                </NavLink>
              </li>
            )}
            <li className="nav-item">
              <SearchForm />
            </li>
            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-light fw-semibold"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user.is_staff ? "Hi Admin" : `Hi ${user.username}`}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <NavLink to="/profile" className="dropdown-item">
                      Profile
                    </NavLink>
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
            ) : (
              <li className="nav-item">
                <NavLink to="/login" className="btn btn-outline-light btn-sm">
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
