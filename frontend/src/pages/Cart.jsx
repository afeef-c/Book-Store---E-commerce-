import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../features/ecommerceSlice";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import api from "../services/api";
import { toast } from "react-toastify";

function Cart() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { cart, status, error } = useSelector((state) => state.ecommerce);
  const user = useSelector((state) => state.auth.user);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);

  useEffect(() => {
    if (user) {
      setIsAdmin(user.is_staff);
      setIsBuyer(!user.is_staff);
    }
  }, [user]);

  useEffect(() => {
    if (isBuyer) {
      dispatch(fetchCart());
    }
  }, [dispatch, isBuyer, location]);

  const deleteItem = async (itemId) => {
    try {
      await api.delete(`api/users/cart_item/${itemId}/`);
      toast.success('Item deleted successfully!');
      dispatch(fetchCart());
    } catch (error) {
      toast.error('Failed to delete item.');
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold">Shopping Cart</h2>
      {status === "loading" ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : cart?.items?.length > 0 ? (
        <div className="card shadow-lg border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Book</th>
                  <th>Cover</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item, index) => (
                  <tr key={item?.book?.id}>
                    <td>{index + 1}</td>
                    <td>{item?.book?.title}</td>
                    <td>
                      <img
                        src={item?.book?.book_image || 'https://images.theconversation.com/files/45159/original/rptgtpxd-1396254731.jpg'}
                        alt={item?.book?.title}
                        className="img-thumbnail rounded"
                        style={{ width: "60px", height: "80px", objectFit: "cover" }}
                      />
                    </td>
                    <td>₹{item?.book?.price}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.sub_total}</td>
                    <td>
                      <button onClick={() => deleteItem(item.id)} className="btn btn-sm btn-danger">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-end p-3">
            <h4>
              <span className="badge bg-success fs-5">Total: ₹{cart.total_price}</span>
            </h4>
          </div>
          <div className="d-flex justify-content-center p-3">
            <NavLink to={'/checkout'} className="btn btn-lg btn-primary shadow-sm">
              Proceed to Checkout
            </NavLink>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning text-center py-4">
          Your cart is currently empty.
        </div>
      )}
    </div>
  );
}

export default Cart;
