import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, fetchOrders, fetchPreferences } from '../features/ecommerceSlice';
import api from '../services/api';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';

function Profile() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const { cart, preferences, orders, status, error } = useSelector((state) => state.ecommerce);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchOrders());
      setIsAdmin(user.is_staff);
      setIsBuyer(!user.is_staff);
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (isBuyer) {
      dispatch(fetchCart());
      dispatch(fetchPreferences());
    }
  }, [dispatch, isBuyer]);

  const handleOrderStatusChange = async (orderId, newStatus) => {
    setLoading(true);
    try {
      await api.patch(`/api/users/orders/${orderId}/`, { newStatus });
      toast.success("Order status updated successfully!");
      await dispatch(fetchOrders());
    } catch (error) {
      toast.error("Error updating status");
      console.error("Error during order status update:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">👤 Profile</h2>
      {isAdmin && (
        <>
          <h4>📦 Stock Management</h4>
          <div className="card shadow p-4 mb-5">
            <p className="text-muted">Manage your stock and orders efficiently.</p>
          </div>
        </>
      )}

      <h4>🛒 Orders</h4>
      <div className="card shadow p-4">
        {orders && orders.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Payment</th>
                  <th>Address</th>
                  <th>Status</th>
                  {isAdmin && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <React.Fragment key={order.id}>
                    <tr onClick={() => toggleExpand(order.id)} style={{ cursor: 'pointer' }}>
                      <td>{index + 1}</td>
                      <td>{order?.user?.username}</td>
                      <td>{order.payment_method}</td>
                      <td>{order.address}</td>
                      <td>{order.status}</td>
                      {isAdmin && (
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                            className="form-select"
                          >
                            <option value="pending">Pending</option>
                            <option value="placed">Placed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                      )}
                    </tr>
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan={isAdmin ? 6 : 5} className="bg-light">
                          <div className="p-3">
                            <h6>📦 Order Details</h6>
                            <p><strong>Address:</strong> {order.address}</p>
                            <p><strong>Phone Number:</strong> {order.phone_number}</p>
                            <h6>🛍️ Items:</h6>
                            <ul>
                              {order.items?.map((item) => (
                                <li key={item.id}>
                                  {item.book.title} - {item.quantity} x ₹{item.book.price} = ₹{item.quantity * item.book_price}
                                </li>
                              ))}
                            </ul>
                            <strong>Total Price:</strong> ₹
                              {order.items?.reduce((total, item) => total + item.quantity * item.book.price, 0)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info text-center">
            <h5>No Orders Yet 🛒</h5>
            <p>Looks like you haven't placed any orders. Browse our collection and start shopping!</p>
            <NavLink to="/book_list" className="btn btn-primary mt-3">Shop Now</NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
