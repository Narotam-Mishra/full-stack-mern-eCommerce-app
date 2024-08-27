import "./Popular.css";
// import data_product from "../Assets/data";
import Item from "../items/Item";
import { useEffect, useState } from "react";

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8421/popularInWomen')
      .then((resp) => resp.json())
      .then((data) => setPopularProducts(data));
  }, [])

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Popular;
