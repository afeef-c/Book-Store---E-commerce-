import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, fetchOrders, fetchPreferences } from '../features/ecommerceSlice';
import api from '../services/api';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';

function Profile() {
  const dispatch = useDispatch();

  // Redux state
  const user = useSelector((state) => state.auth.user);
  const { cart, preferences, orders, status, error } = useSelector((state) => state.ecommerce);
  const [loading, setLoading] = useState(false)
  // Local state
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Toggle expanded order details
  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Fetch orders and set user roles on mount
  useEffect(() => {
    if (user) {
      dispatch(fetchOrders());
      setIsAdmin(user.is_staff);
      setIsBuyer(!user.is_staff);
    }
  }, [dispatch, user]);

  // Fetch buyer-specific data
  useEffect(() => {
    if (isBuyer) {
      dispatch(fetchCart());
      dispatch(fetchPreferences());
    }
  }, [dispatch, isBuyer]);

  // Handle order status change (for admin)
//   const handleOrderStatusChange = (orderId, newStatus) => {
//     console.log(`Order ID: ${orderId}, New Status: ${newStatus}`);

    
//   };

    const handleOrderStatusChange = async (orderId, newStatus) => {
        setLoading(true);
    
        try {
        const response = await api.patch(`/api/users/orders/${orderId}/`, {
            newStatus: newStatus,
        });
    
        toast.success("Order status updated successfully!");
        // Update state or re-fetch orders
        await dispatch(fetchOrders());
        } catch (error) {
        toast.error("Error updating status");
        console.error("Error during order status update:", error);
        } finally {
        setLoading(false);
        }
    };
    

  return (
    <>
    
    <div className="container my-5">
      <h2 className="text-center mb-4">Profile</h2>
    
      {isAdmin&&(
        <>
        <h4>Stock Management</h4>
        <div className="card shadow p-4">
        
            <NavLink to={`/add_book/`} className="btn btn-secondary ">
                Add New Books
            </NavLink>
        </div>
      </>
    )}
      {/* Orders Section */}
      <h4>Orders</h4>
      <div className="card shadow p-4">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">User</th>
                <th scope="col">Payment</th>
                <th scope="col">Address</th>
                <th scope="col">Status</th>
                {isAdmin && <th scope="col">Action</th>}
              </tr>
            </thead>
            <tbody>
              {orders?.map((order, index) => (
                <React.Fragment key={order.id}>
                  {/* Main Row */}
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

                  {/* Expanded Row */}
                  {expandedOrder === order.id && (
                    <tr>
                      <td colSpan={isAdmin ? 6 : 5} className="bg-light">
                        <div className="p-3">
                          <h6>Order Details</h6>
                          <p>
                            <strong>Address:</strong> {order.address}
                          </p>
                          <p>
                            <strong>Phone Number:</strong> {order.phone_number}
                          </p>
                          <p>
                            <strong>Total Price:</strong> ₹{order.total_price}
                          </p>
                          <h6>Order Items:</h6>
                          <ul>
                            {order.items?.map((item) => (
                              <li key={item.id}>
                                {item.book.title} - {item.quantity} x ₹{item.book.price} = ₹
                                {(item.quantity * item.book_price)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* {isBuyer && (
        <div className="mt-5">
          <h4>Your Preferences</h4>
          <div className="card shadow p-4">
            <ul className="list-group">
              {preferences?.map((preference, index) => (
                <li key={index} className="list-group-item">
                  {preference.book.title} - {preference.preference}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )} */}
    </div>
    </>
  );
}

export default Profile;
