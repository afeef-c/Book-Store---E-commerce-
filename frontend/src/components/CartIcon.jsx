import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';



const CartIcon = () => (
    <NavLink to={'/cart'}  className="d-flex justify-content-center align-items-center p-2 bg-light rounded shadow" style={{ width: "50px", height: "50px", cursor: 'pointer', fontSize: '1.5rem'  }}>
        <FontAwesomeIcon icon={faShoppingCart} className="text-primary" />
    </NavLink>

  );
  
  export default CartIcon;
  