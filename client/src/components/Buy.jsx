// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination"; // Import pagination components

// const Buy = () => {
//   const [products, setProducts] = useState([]);
//   const [bestsellers, setBestsellers] = useState([]);
//   const [popup, setPopup] = useState({ show: false, id: "" });
//   const [rating, setRating] = useState(0);
//   const [selectedCategory, setSelectedCategory] = useState("All Products");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [users, setUsers] = useState({});

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 8; // Change this value as per your requirement

//   const makePayment = async () => {
//     const stripe = await loadStripe("<your-stripe-public-key>");
//     // Implement Stripe payment logic here
//   };

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/products");
//         setProducts(response.data);
//         fetchUserDetails(response.data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     const fetchBestsellers = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/bestsellers");
//         setBestsellers(response.data);
//       } catch (error) {
//         console.error("Error fetching bestsellers:", error);
//       }
//     };

//     fetchProducts();
//     fetchBestsellers();
//   }, [rating]);

//   const fetchUserDetails = (products) => {
//     const userPromises = products.map((product) =>
//       axios.get(`http://localhost:3000/users/${product.email}`)
//     );
//     Promise.all(userPromises)
//       .then((responses) => {
//         const usersMap = {};
//         responses.forEach((response) => {
//           const { email, name } = response.data;
//           usersMap[email] = name;
//         });
//         setUsers(usersMap);
//       })
//       .catch((error) => console.error("Error fetching user details!", error));
//   };

//   const handleBuyNow = (id) => {
//     setPopup({ show: true, id });
//   };

//   const handleClosePopup = () => {
//     setPopup({ show: false, id: "" });
//     setRating(0);
//   };

//   const handleSubmitRating = () => {
//     axios
//       .post("http://localhost:3000/ratings", {
//         id: popup.id,
//         rating,
//       })
//       .then((response) => {
//         console.log("Rating submitted:", response.data);
//         handleClosePopup();
//       })
//       .catch((error) => {
//         console.error("Error submitting rating:", error);
//       });
//   };

//   const categorizedProducts = products.reduce((categories, product) => {
//     categories[product.category] = categories[product.category] || [];
//     categories[product.category].push(product);
//     return categories;
//   }, {});

//   const handleCategoryClick = (category) => {
//     setSelectedCategory(category === "All" ? "All Products" : category);
//   };

//   const filteredProducts =
//     selectedCategory === "All Products"
//       ? products
//       : products.filter((product) => product.category === selectedCategory);

//   // Pagination Logic
//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = filteredProducts.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   );
//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gray-50 p-8 mt-12 w-[100vw]">
//       {/* Category Dropdown */}
//       <DropdownMenu onOpenChange={setIsDropdownOpen}>
//         <div className="flex w-full p-2 h-[80px] items-center justify-between">
//           <DropdownMenuTrigger className="flex items-center text-4xl font-bold text-green-800 cursor-pointer">
//             {selectedCategory}
//             {isDropdownOpen ? (
//               <FaChevronUp className="ml-2" />
//             ) : (
//               <FaChevronDown className="ml-2" />
//             )}
//           </DropdownMenuTrigger>
//         </div>
//         <DropdownMenuContent>
//           <DropdownMenuLabel>Select Category</DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem onClick={() => handleCategoryClick("All")}>
//             All Products
//           </DropdownMenuItem>
//           {Object.keys(categorizedProducts).map((category) => (
//             <DropdownMenuItem
//               key={category}
//               onClick={() => handleCategoryClick(category)}
//             >
//               {category}
//             </DropdownMenuItem>
//           ))}
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {/* Product Listing */}
//       <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mx-auto px-4">
//         {currentProducts.length > 0 ? (
//           currentProducts.map((product) => (
//             <div
//               key={product._id}
//               className="p-4 rounded-lg shadow-lg transform transition-transform hover:scale-95 hover:shadow-xl"
//             >
//               <div className="relative mb-4">
//                 <img
//                   src={product.uri}
//                   alt={product.productname}
//                   className="w-full h-48 object-cover rounded-t-lg"
//                 />
//                 <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black opacity-30 rounded-t-lg"></div>
//               </div>
//               <div className="relative z-10">
//                 <h3 className="text-2xl font-bold text-gray-800 mb-3 truncate">
//                   {product.productname}
//                 </h3>
//                 <p className="text-gray-500 mb-2 font-semibold">
//                   by @{users[product.email]}
//                 </p>
//                 <p className="text-gray-600 text-sm h-[35px] overflow-hidden">
//                   About: {product.description}
//                 </p>
//                 <p className="text-gray-600 mb-3">
//                   <span className="font-semibold">Rating:</span>{" "}
//                   {product.rating.toFixed(1)}
//                 </p>
//                 <p className="text-lg font-semibold text-gray-800 mb-1">
//                   Quantity: {product.quantity}{" "}
//                   <span className="text-sm font-normal">Kgs</span>
//                 </p>
//                 <p className="text-lg font-semibold text-gray-800 mb-4">
//                   Price: {product.price}{" "}
//                   <span className="text-sm font-normal">Rs/Kg</span>
//                 </p>
//                 <div className="flex space-x-2 h-12">
//                   <button
//                     onClick={() => handleBuyNow(product._id)}
//                     className="flex-1 py-2 px-2 bg-green-500 text-white rounded-lg shadow-md font-semibold transition hover:bg-green-600"
//                   >
//                     Buy Now
//                   </button>
//                   <button
//                     onClick={makePayment}
//                     className="flex-1 py-2 px-2 bg-yellow-500 text-white rounded-lg shadow-md font-semibold transition hover:bg-yellow-600"
//                   >
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-2xl text-gray-600 col-span-full text-center">
//             No products available.
//           </p>
//         )}
//       </div>
//       <div className="flex justify-center mt-6">
//       <Pagination>
//         <PaginationPrevious
//           className="text-slate-600 hover:cursor-pointer"
//           onClick={() => paginate(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </PaginationPrevious>
//         <PaginationContent>
//           {[...Array(totalPages)].map((_, index) => (
//             <PaginationItem key={index + 1}>
//               <PaginationLink
//                 className={
//                   currentPage === index + 1
//                     ? "bg-green-500 text-white"
//                     : "hover:cursor-pointer"
//                 }
//                 onClick={() => paginate(index + 1)}
//                 active={currentPage === index + 1}
//               >
//                 {index + 1}
//               </PaginationLink>
//             </PaginationItem>
//           ))}
//         </PaginationContent>
//         <PaginationNext
//           className="text-slate-600 hover:cursor-pointer"
//           onClick={() => paginate(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </PaginationNext>
//       </Pagination>
//       </div>
//       {/* {popup.show && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-8 rounded-lg shadow-lg w-96">
//             <h3 className="text-2xl font-bold mb-4">Rate the Product</h3>
//             <div className="mb-4">
//               <label className="block text-gray-700">Your Rating:</label>
//               <input
//                 type="number"
//                 value={rating}
//                 min={1}
//                 max={5}
//                 onChange={(e) => setRating(Number(e.target.value))}
//                 className="w-full p-2 border border-gray-300 rounded-md bg-white"
//               />
//             </div>
//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={handleClosePopup}
//                 className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={handleSubmitRating}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-md"
//               >
//                 Submit Rating
//               </button>
//             </div>
//           </div>
//         </div>
//       )} */}
//       <h2 className="text-4xl font-bold mb-10 text-green-800 mt-12">
//         Our Top Products
//       </h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-screen-lg">
//         {bestsellers.length > 0 ? (
//           bestsellers.map((seller, index) => (
//             <div
//               key={index}
//               className="p-6 pb-2 bg-white rounded-lg shadow-lg text-left fw-bolder"
//             >
//               <h3 className="text-2xl font-semibold text-gray-800 mb-3 text-center">
//                 {seller.email}
//               </h3>
//               <p className="text-gray-600 fw-bold">
//                 product: {seller.productname}
//               </p>
//               <p className="text-gray-600 fw-bold">
//                 avg. Rating: {seller.rating.toFixed(1)}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="text-2xl text-gray-600">No Top Products available.</p>
//         )}
//       </div>

//       {popup.show && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-8 rounded-lg shadow-lg w-1/3 text-center">
//             <h3 className="text-2xl font-semibold mb-4 text-green-800">
//               Thank You!
//             </h3>
//             <p className="text-lg text-gray-800">
//               Thanks for buying from {popup.email}!
//             </p>
//             <div className="mt-4">
//               <label className="block text-gray-700 mb-2">
//                 Rate the Seller (1-5 stars):
//               </label>
//               <select
//                 value={rating}
//                 required
//                 onChange={(e) => setRating(Number(e.target.value))}
//                 className="border p-2 bg-white rounded w-full"
//               >
//                 <option value="" disabled>
//                   Select a rating
//                 </option>
//                 <option value={1}>1 - Very Poor</option>
//                 <option value={2}>2 - Poor</option>
//                 <option value={3}>3 - Average</option>
//                 <option value={4}>4 - Good</option>
//                 <option value={5}>5 - Excellent</option>
//               </select>
//             </div>
//             <button
//               onClick={handleSubmitRating}
//               className="mt-4 py-2 px-4 bg-green-500 text-white rounded-lg shadow-lg font-semibold transform transition hover:bg-green-600 hover:scale-105"
//             >
//               Submit Rating
//             </button>
//             <button
//               onClick={handleClosePopup}
//               className="mt-4 py-2 px-4 bg-gray-500 text-white rounded-lg shadow-lg font-semibold transform transition hover:bg-gray-600 hover:scale-105"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     {/* </div> */}
//     </div>
//   );
// };

// export default Buy;

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Import pagination components
import { CartContext } from "./CartContext";
import { useNavigate } from "react-router-dom";
const Buy = () => {
  const [products, setProducts] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [popup, setPopup] = useState({ show: false, id: "" });
  const [rating, setRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [users, setUsers] = useState({});
  const navigate = useNavigate();
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Change this value as per your requirement
  const { updateCartItems } = useContext(CartContext);

  //     axios.post(`http://localhost:3000/cart/${productId}`)
  //       .then(response => {
  //         console.log("Item added to cart:", response.data);
  //       })

  // };

  // Assuming `updateCartItems` is a function that updates the cart state in context or parent component
  // const addToCart = (productId) => {
  //   axios
  //     .post(`http://localhost:3000/cart/${productId}`)
  //     .then((response) => {
  //       console.log("Item added to cart:", response.data);
  //       updateCartItems((prevItems) => [...prevItems, response.data]); // Add new item to the existing cart items
  //     })
  //     .catch((error) => {
  //       console.error("Error adding item to cart:", error);
  //     });
  // };

  const addToCart = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem('auth'));
      if (!user || !user.auth) {
        alert('Please login first.');
        navigate('/signin');
        return;
      }

      const mail = user.email;
      if (!mail) {
        alert('User is missing!');
        return;
      }

      const response = await axios.post('http://localhost:3000/cart', {
        mail,
        prodId: productId,
      });

      console.log('Added to cart:', response.data);
      navigate('/cart');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add.');
    }
  };

  const makePayment = async () => {
    const stripe = await loadStripe("<your-stripe-public-key>");
    // Implement Stripe payment logic here
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        setProducts(response.data);
        fetchUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchBestsellers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/bestsellers");
        setBestsellers(response.data);
      } catch (error) {
        console.error("Error fetching bestsellers:", error);
      }
    };

    fetchProducts();
    fetchBestsellers();
  }, [rating]);

  const fetchUserDetails = (products) => {
    const userPromises = products.map((product) =>
      axios.get(`http://localhost:3000/users/${product.email}`)
    );
    Promise.all(userPromises)
      .then((responses) => {
        const usersMap = {};
        responses.forEach((response) => {
          const { email, name } = response.data;
          usersMap[email] = name;
        });
        setUsers(usersMap);
      })
      .catch((error) => console.error("Error fetching user details!", error));
  };

  const handleBuyNow = (id) => {
    setPopup({ show: true, id });
  };

  const handleClosePopup = () => {
    setPopup({ show: false, id: "" });
    setRating(0);
  };

  const handleSubmitRating = () => {
    axios
      .post("http://localhost:3000/ratings", {
        id: popup.id,
        rating,
      })
      .then((response) => {
        console.log("Rating submitted:", response.data);
        handleClosePopup();
      })
      .catch((error) => {
        console.error("Error submitting rating:", error);
      });
  };

  const categorizedProducts = products.reduce((categories, product) => {
    categories[product.category] = categories[product.category] || [];
    categories[product.category].push(product);
    return categories;
  }, {});

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === "All" ? "All Products" : category);
  };

  const filteredProducts =
    selectedCategory === "All Products"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-8 mt-12 w-[100vw]">
      {/* Category Dropdown */}
      <DropdownMenu onOpenChange={setIsDropdownOpen}>
        <div className="flex w-full p-2 h-[80px] items-center justify-between">
          <DropdownMenuTrigger className="flex items-center text-4xl font-bold text-green-800 cursor-pointer">
            {selectedCategory}
            {isDropdownOpen ? (
              <FaChevronUp className="ml-2" />
            ) : (
              <FaChevronDown className="ml-2" />
            )}
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent>
          <DropdownMenuLabel>Select Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleCategoryClick("All")}>
            All Products
          </DropdownMenuItem>
          {Object.keys(categorizedProducts).map((category) => (
            <DropdownMenuItem
              key={category}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Product Listing */}
      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mx-auto px-4">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div
              key={product._id}
              className="p-4 rounded-lg shadow-lg transform transition-transform hover:scale-95 hover:shadow-xl"
            >
              <div className="relative mb-4">
                <img
                  src={product.uri}
                  alt={product.productname}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black opacity-30 rounded-t-lg"></div>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 truncate">
                  {product.productname}
                </h3>
                <p className="text-gray-500 mb-2 font-semibold">
                  by @{users[product.email]}
                </p>
                <p className="text-gray-600 text-sm h-[35px] overflow-hidden">
                  About: {product.description}
                </p>
                <p className="text-gray-600 mb-3">
                  <span className="font-semibold">Rating:</span>{" "}
                  {product.rating.toFixed(1)}
                </p>
                <p className="text-lg font-semibold text-gray-800 mb-1">
                  Quantity: {product.quantity}{" "}
                  <span className="text-sm font-normal">Kgs</span>
                </p>
                <p className="text-lg font-semibold text-gray-800 mb-4">
                  Price: {product.price}{" "}
                  <span className="text-sm font-normal">Rs/Kg</span>
                </p>
                <div className="flex space-x-2 h-12">
                  <button
                    onClick={() => handleBuyNow(product._id)}
                    className="flex-1 py-2 px-2 bg-green-500 text-white rounded-lg shadow-md font-semibold transition hover:bg-green-600"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => {
                      addToCart(product._id);
                    }}
                    className="flex-1 py-2 px-2 bg-yellow-500 text-white rounded-lg shadow-md font-semibold transition hover:bg-yellow-600"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-2xl text-gray-600 col-span-full text-center">
            No products available.
          </p>
        )}
      </div>
      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationPrevious
            className="text-slate-600 hover:cursor-pointer"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </PaginationPrevious>
          <PaginationContent>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  className={
                    currentPage === index + 1
                      ? "bg-green-500 text-white"
                      : "hover:cursor-pointer"
                  }
                  onClick={() => paginate(index + 1)}
                  active={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
          <PaginationNext
            className="text-slate-600 hover:cursor-pointer"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </PaginationNext>
        </Pagination>
      </div>

      <h2 className="text-4xl font-bold mb-10 text-green-800 mt-12">
        Our Top Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-screen-lg">
        {bestsellers.length > 0 ? (
          bestsellers.map((seller, index) => (
            <div
              key={index}
              className="p-6 pb-2 bg-white rounded-lg shadow-lg text-left fw-bolder"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-3 text-center">
                {seller.email}
              </h3>
              <p className="text-gray-600 fw-bold">
                product: {seller.productname}
              </p>
              <p className="text-gray-600 fw-bold">
                avg. Rating: {seller.rating.toFixed(1)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-2xl text-gray-600">No Top Products available.</p>
        )}
      </div>

      {popup.show && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-green-800">
              Thank You!
            </h3>
            <p className="text-lg text-gray-800">
              Thanks for buying from {popup.email}!
            </p>
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">
                Rate the Seller (1-5 stars):
              </label>
              <select
                value={rating}
                required
                onChange={(e) => setRating(Number(e.target.value))}
                className="border p-2 bg-white rounded w-full"
              >
                <option value="" disabled>
                  Select a rating
                </option>
                <option value={1}>1 - Very Poor</option>
                <option value={2}>2 - Poor</option>
                <option value={3}>3 - Average</option>
                <option value={4}>4 - Good</option>
                <option value={5}>5 - Excellent</option>
              </select>
            </div>
            <button
              onClick={handleSubmitRating}
              className="mt-4 py-2 px-4 bg-green-500 text-white rounded-lg shadow-lg font-semibold transform transition hover:bg-green-600 hover:scale-105"
            >
              Submit Rating
            </button>
            <button
              onClick={handleClosePopup}
              className="mt-4 py-2 px-4 bg-gray-500 text-white rounded-lg shadow-lg font-semibold transform transition hover:bg-gray-600 hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buy;
