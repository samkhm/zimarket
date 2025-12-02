import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import API from '@/services/api'

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getItems = async () => {
      setLoading(true);
      try {
          const res = await API.get("/catalog/getItems");
          setItems(res.data);
          console.log(res.data);
      } catch (error) {
          console.log("Failed to get Items", error);
      } finally {
          setLoading(false);
      }
  };
 
  useEffect(() =>{
    getItems();
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, []);



  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addCart = (item) => {
    if (!item.available) {
      toast.error(`${item.name} is not available.`);
      return;
    }
    const price = Number(item.price); // convert string to number
  
    setCartItems((prevCart) => {
      // Check if the item with the same _id exists
      const existing = prevCart.find((i) => i._id === item._id);
  
      if (existing) {
        toast.success(`Increased quantity of ${item.name}`);
        // Increment quantity if item already exists
        return prevCart.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        // Add new item
        toast.success(`${item.name} added to cart`)
        return [...prevCart, { ...item, price, quantity: 1 }];
      }
    });
  };
  
  
  
  

  // Remove item from cart
  const removeCart = (_id) => {
    setCartItems(cartItems.filter((i) => i._id !== _id));
  };

  // Update quantity
  const updateCartQuantity = (_id, quantity) => {
    if (quantity < 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }
  
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item._id === _id ? { ...item, quantity } : item
      )
    );
  };

  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <BrowserRouter>
      <Header cartCount={cartItems.length} items={items} />
      <Routes>
        <Route path="/" element={<Home addCart={addCart} items={items} loading={loading} />} />
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              removeCart={removeCart}
              updateCartQuantity={updateCartQuantity}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  </>
  );
}
