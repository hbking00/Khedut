// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch cart items from the backend
//     console.log(cartItems);
//     axios.get('http://localhost:3000/cart')
//       .then(response => {
//         setCartItems(response.data);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching cart items:', error);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return <div>Loading cart items...</div>;
//   }

//   return (
//     <div>
//       <h1>Cart Items</h1>
//       {cartItems.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <ul>
//           {cartItems.map(item => (
//             <li key={item._id}>
//               <h2>{item.productname}</h2>
//               <p>Price: ${item.price}</p>
//               <p>Quantity: {item.quantity}</p>
//               <p>Description: {item.description}</p>
//               <img src={item.uri} alt={item.productname} width="100" />
//               <p>Category: {item.category}</p>
//               <p>Rating: {item.rating}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Cart;

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
const Cart = () => {
  const user = JSON.parse(localStorage.getItem("auth")) || {
    auth: false,
    id: "",
  };
  const [products, setProducts] = useState([]);
  const [prodDetails, setProdDetails] = useState([]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const [u] = await Promise.all([
  //       axios.get(`http://localhost:3000/users/${user.email}`),
  //     ]);
  //     console.log(u.data);
  //     setProducts(u.data.cart);
  //     const prodDetailsPromises = u.data.cart.map((prodId) =>
  //       axios.get(`http://localhost:3000/cart/${prodId}`)
  //     );
  //     const prodDetailsResponses = await Promise.all(prodDetailsPromises);
  //     setProdDetails(prodDetailsResponses.map((response) => response.data));
  //   };

  //   fetchProducts();
  // }, [user.email]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/${user.email}`);
        const userData = response.data;
        console.log(userData);
        if (!userData || !userData.cart) {
          console.warn("Cart data is undefined or empty.");
          setProducts([]);
          setProdDetails([]);
          return;
        }
  
        setProducts(userData.cart);
        
        const prodDetailsPromises = userData.cart.map((prodId) =>
          axios.get(`http://localhost:3000/cart/${prodId}`)
      );
      
      const prodDetailsResponses = await Promise.all(prodDetailsPromises);
      setProdDetails(prodDetailsResponses.map((response) => response.data));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, [user.email]);
  
  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <h1 className="text-3xl font-bold mb-6">Cart Items</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {prodDetails.map((product, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col hover:scale-105 transform transition-all duration-300 hover:shadow-2xl"
          >
            <img
              src={product.uri}
              alt={product.productname}
              className="w-full h-40 object-cover mb-4 rounded-lg"
            />
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              {product.productname}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{product.price}</p>
            <p className="text-sm text-gray-600 mb-2">{product.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
