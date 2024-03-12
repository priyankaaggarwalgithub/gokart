import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,

    CART_SAVE_PAYMENT_METHOD,

    CART_CLEAR_ITEMS,
    SET_QUOTATION,
    SET_MAX_ALLOWED_QUOTATION,

} from '../constants/cartConstants'

const initialState = {
    quotation: '0.00',
    cartItems: [],
    shippingAddress: {},
    maxAllowedQuotation: localStorage.getItem('maxAllowedQuotation') || 0,
  };

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case CART_ADD_ITEM:
            const item = action.payload
            const existItem = state.cartItems.find(x => x.product === item.product)

            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(x =>
                        x.product === existItem.product ? item : x)
                }

            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }

        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x.product !== action.payload)
            }

        case CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload
            }

        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload
            }

        case CART_CLEAR_ITEMS:
            return {
                ...state,
                cartItems: []
            }
            
        case SET_QUOTATION:
            return {
               ...state,
                quotation: action.payload || 0.00,
            }
            case SET_MAX_ALLOWED_QUOTATION:
                return {
                  ...state,
                  maxAllowedQuotation: action.payload,
                }
        default:
            return state
            
    }
}