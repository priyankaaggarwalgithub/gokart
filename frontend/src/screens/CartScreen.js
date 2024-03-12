import React, { useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card ,InputGroup,Alert} from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart,setQuotation } from '../actions/cartActions'

function CartScreen({ match, location, history }) {
    const productId = match.params.id
    console.log(productId)
    const qty = location.search ? Number(location.search.split('=')[1]) : 1
    const dispatch = useDispatch()
    
    const cart = useSelector(state => state.cart)
    const { cartItems } = cart
    const [showAlert, setShowAlert] = useState(false);

    const [isQuotationValid, setQuotationValid] = useState(true);
    const [allowBidding, setAllowBidding] = useState(false);
    

    const [quotation, setQuotationLocal] = useState(() =>cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)
);
const handleSubmit = () => {
    const valid = (quotation >= maxAllowedQuotation) && (quotation <= cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2))
    
    setQuotationValid(valid);
    setShowAlert(true);
}
useEffect(() => {
    const allow = cartItems.some((item) => item.qty > 5);
    setAllowBidding(allow);
});


const handleQuotationChange = (e) => {
    
    setQuotationLocal(e.target.value);
    
    dispatch(setQuotation(parseFloat(e.target.value)));
};      
useEffect(() => {
    setQuotationLocal((prevQuotation) => {
      const newQuotation = parseFloat(cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2));
      return prevQuotation !== newQuotation ? newQuotation : prevQuotation;
    });
  },  [
    cartItems]);
  
const productIds = cartItems.map(item => ({ id: item.product, qty: item.qty }));
console.log(productIds);

const individualDiscounts = {
    1: 0.05, // 5%  discount for product ID 1
    2: 0.1, // 10% discount for product ID 2
    3: 0.1, // 10% discount for product ID 3
    4: 0.1, // 10% discount for product ID 4
    5: 0.05, // 5% discount for product ID 5
    6: 0.05, // 5% discount for product ID 6
};
const maxAllowedQuotation = cartItems.reduce((acc, item) => {
    const discountPercentage = item.qty >= 5 ? (individualDiscounts[item.product] || 0) : 0;
    return acc + item.qty * item.price * (1 - discountPercentage);
  }, 0);
  
 console.log(maxAllowedQuotation)
 console.log(quotation)
 console.log(cartItems.reduce((acc, item) => acc + item.qty * item.price, 0))
 
 
        
    useEffect(() => {
        if (productId) {
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty])


    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const checkoutHandler = () => {
        if (isQuotationValid) {
            dispatch(setQuotation(quotation));
            console.log(quotation);
            history.push('/login?redirect=shipping');
        }
        
        
        else if (quotation > cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)) {
          
            alert("Bid is greater than the total price");
        } 
         else {
            
           
            alert("Bid is too low");
        }
    };

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Message variant='info'>
                        Your cart is empty <Link to='/'>Go Back</Link>
                    </Message>
                ) : (
                        <ListGroup variant='flush'>
                            {cartItems.map(item => (
                                <ListGroup.Item key={item.product}>
                                    <Row>
                                        <Col md={2}>
                                            <Image src={item.image} alt={item.name} fluid rounded />
                                        </Col>
                                        <Col md={3}>
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        </Col>

                                        <Col md={2}>
                                        ₹{item.price}
                                        </Col>

                                        <Col md={3}>
                                            <Form.Control
                                                as="select"
                                                value={item.qty}
                                                onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}
                                            >
                                                {

                                                    [...Array(item.countInStock).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))
                                                }

                                            </Form.Control>
                                        </Col>

                                        <Col md={1}>
                                            <Button
                                                type='button'
                                                variant='light'
                                                onClick={() => removeFromCartHandler(item.product)}
                                            >
                                                <i className='fas fa-trash'></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
            </Col>

            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
                            ₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                        </ListGroup.Item>
                    </ListGroup>
                    {allowBidding && (
                    <ListGroup.Item>
                            <Form.Group controlId='quotation'>
                                <Form.Label>Enter Bid:</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>₹</InputGroup.Text>
                                    <Form.Control
                                        type='text'
                                        placeholder='0.00'
                                        value={quotation|| ''}
                                        onChange={handleQuotationChange}
                                    />
                                </InputGroup>
                            </Form.Group>
                            <ListGroup.Item>
       
                                <Button
                                    type='button'
                                    className='btn-block'
                                    onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </ListGroup.Item>
                           
                        </ListGroup.Item>
                         )}
                        {showAlert && (
                    <Alert variant={isQuotationValid ? 'success' : 'danger'}>
                        {isQuotationValid ? 'Bid Accepted! Please proceed to checkout' : 'Bid Invalid! Use a valid Bid'}
                    </Alert>
                            )}
                    
                    <ListGroup.Item>
                        <Button
                            type='button'
                            className='btn-block'
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                        >
                            Proceed To Checkout
                        </Button>
                    </ListGroup.Item>


                </Card>
            </Col>
        </Row>
    )
}

export default CartScreen