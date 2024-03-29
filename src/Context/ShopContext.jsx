import React, { createContext, useEffect, useState } from "react";
import {API_BASE_URL } from "../config/config";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let i = 0; i < 300+1; i++) {
    cart[i] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [all_product, setAll_Product] = useState([]);

  //fetch all data
  useEffect(() => {
    fetch(`${API_BASE_URL}/allproducts`)
    .then((response)=>response.json())
    .then((data)=>setAll_Product(data));

    if(localStorage.getItem('auth-token')){
      fetch(`${API_BASE_URL}/getcart`,{
        method:"POST",
        headers:{
          Accept:'application/json',
          'auth-token':`${localStorage.getItem('auth-token')}`,
      'Content-Type':'application/json',
        },
        body:"",
      }).then((response)=>response.json())
      .then((data)=>setCartItems(data));

    }
  }, []);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    // console.log(cartItems);
    if(localStorage.getItem('auth-token')){
      fetch(`${API_BASE_URL}/addtocart`,{
        method:"POST",
        headers:{
          Accept:'application/json',
         'auth-token':`${localStorage.getItem('auth-token')}`,
         'Content-Type':'application/json'
        },
        body:JSON.stringify({"itemId":itemId})
      })
      .then((response)=>response.json())
      .then((data)=>console.log(data))
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    
    if(localStorage.getItem('auth-token')){
      fetch(`${API_BASE_URL}/removefromcart`,{
        method:"POST",
        headers:{
          Accept:'application/json',
         'auth-token':`${localStorage.getItem('auth-token')}`,
         'Content-Type':'application/json'
        },
        body:JSON.stringify({"itemId":itemId})
      })
      .then((response)=>response.json())
      .then((data)=>console.log(data))
    }

  };

  //total amount
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find(
          (product) => product.id === Number(item)
        );
        totalAmount += cartItems[item] * itemInfo.new_price;
      }
    }
    return totalAmount;
  };

  //total items in cart
  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
export default ShopContextProvider;
