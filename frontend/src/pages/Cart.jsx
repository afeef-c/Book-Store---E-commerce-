import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../features/ecommerceSlice";
import { NavLink } from "react-router-dom";

function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.ecommerce.cart);
  const user = useSelector((state) => state.auth.user);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);

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

  console.log("cart: ", cart);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Shopping Cart</h2>
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
          
        <NavLink to={'/checkout'}  className="d-flex justify-content-center align-items-center p-2 bg-light rounded shadow" >
            Checkout
        </NavLink> 

        </div>
      ) : (
        <div className="alert alert-warning text-center" role="alert">
          Your cart is empty.
        </div>
      )}
    </div>
  );
}

export default Cart;
