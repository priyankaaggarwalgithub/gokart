import axios from 'axios'
import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    SET_QUOTATION,
    CART_SAVE_PAYMENT_METHOD,
    SET_MAX_ALLOWED_QUOTATION ,
} from '../constants/cartConstants'


export const addToCart = (id, qty) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/${id}`)

    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty
        }
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}



export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id,
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}


export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data,
    })

    localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data,
    })

    localStorage.setItem('paymentMethod', JSON.stringify(data))
}
export const setQuotation = (quotation) => (dispatch) => {
    dispatch({
      type: SET_QUOTATION,
      payload: quotation,
    });
  
    // You can also save the quotation in localStorage if needed
    localStorage.setItem('quotation', JSON.stringify(quotation));
  };

  export const setMaxAllowedQuotation = (maxAllowedQuotation) => (dispatch) => {
    dispatch({
        type: SET_MAX_ALLOWED_QUOTATION,
        payload: maxAllowedQuotation,
    });

  
      // Update local storage
      localStorage.setItem('maxAllowedQuotation', maxAllowedQuotation);
    };
  