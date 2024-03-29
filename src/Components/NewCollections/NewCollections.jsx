import "./NewCollections.css"
import Item from "../Item/Item";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/config";
const NewCollections = () => {
  const [new_collection ,setNew_Collection] =useState([]);
  useEffect(()=>{
    fetch(`${API_BASE_URL}/newcollections`)
    .then((response)=>response.json())
    .then((data)=>setNew_Collection(data));
  },[])

  return (
    <div className="new-collections">
      <h1>NEW COLLECTION</h1>
      <hr/>
     <div className="collections">
      {
        new_collection.map((item , i)=>{
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          )
        })
      }
    </div>
    </div>
  )
}

export default NewCollections
