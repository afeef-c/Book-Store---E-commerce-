import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, placeOrder } from "../features/ecommerceSlice";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../services/api";

function CheckOut() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.ecommerce.cart);
  const user = useSelector((state) => state.auth.user);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Default payment method is COD
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      if (user.is_staff) {
        setIsAdmin(true);
      } else {
        setIsBuyer(true);
      }
    }
  }, [user]);
  
  useEffect(() => {
    if (isBuyer) {
      dispatch(fetchCart());
    }
  }, [dispatch, isBuyer]);
  
  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post("/api/users/orders/", {
        address,
        phone_number: phoneNumber,
        payment_method: paymentMethod,
      });
      toast.success("Order placed succesfully")
      navigate('/');
      return response.data;
      // Redirect to the order confirmation page after successful checkout
      
    } catch (error) {
        toast.error("Error during checkout", error);
        console.error("Error during checkout", error);

    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Checkout</h2>
      {cart?.items?.length > 0 ? (
        <div className="card shadow p-4">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Book</th>
                  <th scope="col">Cover</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item, index) => (
                  <tr key={item.book.id}>
                    <td>{index + 1}</td>
                    <td>{item.book.title}</td>
                    <td>
                      <img
                        src={item.book.book_image} // Assuming this is the correct field for the image URL
                        alt={item.book.title}
                        className="img-thumbnail"
                        style={{ width: "60px", height: "80px", objectFit: "cover" }}
                      />
                    </td>
                    <td>₹{item.book.price}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.sub_total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-end">
            <h4 className="mt-4">
              <span className="badge bg-success">
                Total Price: ₹{cart.total_price}
              </span>
            </h4>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleCheckout} className="mt-4">
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <textarea
                className="form-control"
                name="address"
                value={address}
                id="address"
                onChange={(e) => setAddress(e.target.value)}
                
                required
              />
              
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                className="form-control"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Payment Method</label>
              <div>
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="cod" className="ms-2">Cash on Delivery (COD)</label>
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="alert alert-warning text-center" role="alert">
            Can`t process checkout pleas try again later
        </div>
      )}
    </div>
  );
}

export default CheckOut;
