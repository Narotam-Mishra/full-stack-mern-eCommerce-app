/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
// import all_product from '../components/Assets/all_product'

export const ShopContext = createContext(null);

//get default cart items
const getDefaultCart = () => {
    let cart = {};
    for(let i=0; i<300+1; i++){
        cart[i] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {

    const [all_product, setAllProducts] = useState([]);
    const[cartItems, setCartItems] = useState(getDefaultCart());
    
    useEffect(() => {
        fetch('http://localhost:8421/allProducts')
        .then((resp) => resp.json())
        .then((data) => setAllProducts(data))

        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:8421/getCart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: "",
            })
            .then((resp) => resp.json())
            .then((data) => setCartItems(data))
        }
    },[])
    
    // console.log(cartItems);

    // add to cart function
    const addToCart = (itemId) => {
        setCartItems((prev) => ({...prev, [itemId]:prev[itemId]+1}));
        // console.log(cartItems);

        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:8421/addToCart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"itemId":itemId})
            })
            .then((resp) => resp.json())
            .then((data) => console.log(data))
        }
    }

    // function to remove items from cart
    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({...prev, [itemId]:prev[itemId]-1}));
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:8421/removeFromCart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"itemId":itemId})
            })
            .then((resp) => resp.json())
            .then((data) => console.log(data))
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems)
        {
            if(cartItems[item] > 0){
                let itemInfo = all_product.find((product) => product.id === Number(item))
                totalAmount += (itemInfo.new_price * cartItems[item]);
            }
        }
        //console.log(totalAmount);
        return totalAmount;
    }

    // function to calculate total count of cart items
    const getTotalCartItems = () => {
        let totalItems = 0;
        for(const item in cartItems)
        {
            if(cartItems[item] > 0){
                totalItems += cartItems[item];
            }
        }
        return totalItems;
    }

    // using context value to share required functions and objects among components
    const contextValue = {getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart};
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;