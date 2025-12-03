import React, { useState } from "react";
import toast from "react-hot-toast";
import API from "@/services/api";


export default function Cart({ cartItems, removeCart, updateCartQuantity }) {
  const [showDialog, setShowDialog] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    location: "",
    hostel: "",
  });

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    // Prevent empty cart
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
  
    // Validate user details
    if (
      !userDetails.name ||
      !userDetails.phone ||
      !userDetails.location ||
      !userDetails.hostel
    ) {
      toast.error("Please fill in all customer details.");
      return;
    }
  
    // Filter items that are still available
    const availableOrderItems = cartItems.filter((item) => item.available);
  
    if (availableOrderItems.length === 0) {
      toast.error("No available items in your cart.");
      return;
    }
  
    // Build WhatsApp receipt message
    let message = `🛒 *Order Receipt*\n\n`;
  
    message += `*Customer Details*\n`;
    message += `Name: ${userDetails.name}\n`;
    message += `Phone: ${userDetails.phone}\n`;
    message += `Location: ${userDetails.location}\n`;
    message += `Hostel: ${userDetails.hostel}\n\n`;
  
    message += `*Items*\n`;
    message += "--------------------------------\n";
    message += "`No  Item             Qty   Subtotal`\n";
  
    availableOrderItems.forEach((item, idx) => {
      const subtotal = Number(item.price) * item.quantity;
      const name = item.name.padEnd(15, " ");
      const qty = item.quantity.toString().padEnd(5, " ");
  
      message += `\`${idx + 1}. ${name} ${qty} Ksh.${subtotal}\`\n`;
    });
  
    message += "--------------------------------\n";
    message += `*Total: Ksh. ${totalPrice.toFixed(2)}*`;
  
    const encodedMessage = encodeURIComponent(message);
    const sellerNumber = "254114303482";
    const waUrl = `https://wa.me/${sellerNumber}?text=${encodedMessage}`;
  
    try {
      // MARK ITEMS UNAVAILABLE IN BACKEND
      const resUpdate = await API.post("/catalog/markUnavailable", {
        itemIds: availableOrderItems.map((item) => item._id),
      });
  
      if (resUpdate.data) {
        toast.success("Order sent and items updated!");
      }
    } catch (err) {
      console.log("Failed to mark as unavailable:", err);
      toast.error("Order sent, but failed to update item availability.");
    }
  
    // Open WhatsApp
    window.open(waUrl, "_blank");
  
    // Close dialog
    setShowDialog(false);
  };
  

  const handleOverlayClick = (e) => {
    if (e.target.id === "overlay") setShowDialog(false);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 md:p-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Quantity</th>
                <th className="p-4 text-left">Subtotal</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="p-4 flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span>{item.name}</span>
                  </td>
                  <td className="p-4">Ksh. {Number(item.price).toFixed(2)}</td>
                  <td className="p-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (isNaN(value) || value < 1) return;
                      updateCartQuantity(item._id, value);
                    }}
                    className="w-20 p-1 border rounded text-center"
                  />

                  </td>
                  <td className="p-4">
                    Ksh. {(Number(item.price) * item.quantity).toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => removeCart(item._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xl font-semibold">
              Total: Ksh. {totalPrice.toFixed(2)}
            </span>
            <button
              onClick={() => setShowDialog(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition"
            >
              Place order via WhatsApp
            </button>
          </div>

          {/* Dialog */}
          {showDialog && (
            <div
              id="overlay"
              onClick={handleOverlayClick}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
                <h2 className="text-2xl font-bold mb-4">Your Details</h2>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={userDetails.name}
                  onChange={handleChange}
                  className="w-full p-2 border mb-3 rounded"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={userDetails.phone}
                  onChange={handleChange}
                  className="w-full p-2 border mb-3 rounded"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={userDetails.location}
                  onChange={handleChange}
                  className="w-full p-2 border mb-3 rounded"
                />
                <input
                  type="text"
                  name="hostel"
                  placeholder="Hostel Name"
                  value={userDetails.hostel}
                  onChange={handleChange}
                  className="w-full p-2 border mb-3 rounded"
                />
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setShowDialog(false)}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
                  >
                    Send Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
