import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {
    const [image ,setImage] = useState(false);
    const [productDetails ,setProductDetails] = useState({
        name:"",
        image:"",
        category:"women",
        new_price:"",
        old_price:""
    })

    const imageHandler =(e)=>{
           setImage(e.target.files[0]) 
    }

    const changeHandler = (e)=>{
        setProductDetails({...productDetails,[e.target.name]:e.target.value})
    }

    //adddata to database
    const Add_product = async () => {
        console.log(productDetails);
        let responseData;
        let product = productDetails;
    
        let formData = new FormData();
        formData.append('product', image);
    
        try {
            const response = await fetch('http://localhost:4000/upload', {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                },
                body: formData,
            });
    
            const data = await response.json();
            responseData = data;
    
            if (responseData.success) {
                product.image = responseData.image_url;
    
                const addProductResponse = await fetch('http://localhost:4000/addproduct', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product),
                });
    
                const addProductData = await addProductResponse.json();
    
                if (addProductData.success) {
                    alert('Product Added');
                } else {
                    alert('Failed to add product');
                }
            }
    
        } catch (error) {
            console.error("Error:", error.message);
        }
    }
    

  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changeHandler} type='text' name='name' placeholder='Type Here' />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfields">
            <p>Price</p>
            <input value={productDetails.old_price} onChange={changeHandler}  type='text' name="old_price"/>

        </div>
        <div className="addproduct-itemfields">
            <p>Offer Price</p>
            <input value={productDetails.new_price} onChange={changeHandler} type='text' name="new_price"/>
        </div>
      </div>
    <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select  value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kid">Kid</option>
        </select>
    </div>
    <div className="addproduct-itemfield">
        <label htmlFor="file-input">
            <img src={image ? URL.createObjectURL(image):upload_area} className='addproduct-thumnail-img' />
        </label>
        <input onChange={imageHandler} type='file' name='image' id='file-input' hidden/>
    </div>
    <button onClick={()=>{Add_product()}} className='addproduct-btn'>ADD</button>
    </div>
  )
}


export default AddProduct;
