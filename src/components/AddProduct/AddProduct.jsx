import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import config from '../../../config/config'; // Adjust the path accordingly

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    try {
      if (!image) {
        alert("Please select an image.");
        return;
      }

      const formData = new FormData();
      formData.append("product", image);

      const responseUpload = await fetch(`${config.apiUrl}/upload`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!responseUpload.ok) {
        throw new Error(`Error uploading image: ${responseUpload.statusText}`);
      }

      const responseData = await responseUpload.json();

      if (responseData.success) {
        productDetails.image = responseData.image_url;

        const responseAddProduct = await fetch(`${config.apiUrl}/addproduct`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productDetails),
        });

        if (!responseAddProduct.ok) {
          throw new Error(`Error adding product: ${responseAddProduct.statusText}`);
        }

        const data = await responseAddProduct.json();

        data.success ? alert("Product Added") : alert("Failed");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="add-product">
      {/* Input fields for product details */}
      {/* ... */}
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumnail-img"
            alt="Upload Area"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <button
        onClick={Add_Product}
        className="addproduct-btn"
      >
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
