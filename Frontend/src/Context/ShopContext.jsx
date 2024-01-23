import React ,{createContext, useState ,useEffect} from 'react';
import all_product from '../Assets/all_product.js'

export const ShopContext = createContext(null);

const getDefaultCart = ()=>{
    let cart = {};
    for(let i=0; i< all_product.length+1 ; i++){
        cart[i] = 0;
    }
    return cart;
}

const ShopContextProvider  = (props)=>{
    const [cartItems ,setCartItems ] = useState(getDefaultCart());
    useEffect(() => {
        console.log(cartItems);
      },[cartItems]);
    


   const addToCart =(itemId) =>{
    setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
    // console.log(cartItems);
   }

   const removeFromCart =(itemId) =>{
    setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
   }

   //total amount
   const getTotalCartAmount = ()=>{
    let totalAmount = 0;
    for(const item in cartItems){

        if(cartItems[item] >0){
            let itemInfo = all_product.find((product)=> product.id === Number(item) );
            totalAmount += cartItems[item] * itemInfo.new_price;
        }
       
    }
    return totalAmount;
    
   }

   //total items in cart
 const getTotalCartItems = ()=>{
    let totalItem = 0 ;
    for(const item in cartItems){
        if(cartItems[item] >0){
            totalItem += cartItems[item];
        }
    }
    return totalItem;
 }


   const contextValue = {getTotalCartItems, getTotalCartAmount,all_product ,cartItems ,addToCart ,removeFromCart};
    return(
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;


