



// import Dealer from "../models/dealerModel.js";
// import Order from "../models/orderModel.js";

// // -----------------------------
// // PLACE ORDER
// // -----------------------------
// export const placeOrder = async (req, res) => {
//   try {
//     const { dealerId, items } = req.body;

//     if (!dealerId || !items || items.length === 0) {
//       return res.status(400).json({ error: "Dealer ID and items are required" });
//     }

//     const dealer = await Dealer.findById(dealerId);
//     if (!dealer) return res.status(404).json({ error: "Dealer not found" });

//     const totalAmount = items.reduce(
//       (sum, item) => sum + item.price * item.qty,
//       0
//     );

//     const order = new Order({
//       dealerId,
//       address: dealer.shopAddress,
//       items,
//       totalAmount
//     });

//     await order.save();

//     res.status(201).json({
//       message: "Order placed successfully",
//       order
//     });

//   } catch (err) {
//     console.error("Error placing order:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // -----------------------------
// // GET ALL ORDERS
// // -----------------------------
// export const getAllOrders = async (req, res) => {
//   try {
//     const { dealerId } = req.query;

//     let query = {};
//     if (dealerId) {
//       query.dealerId = dealerId;
//     }

//     const orders = await Order.find(query)
//       .populate("dealerId", "name contact shopAddress")
//       .sort({ createdAt: -1 });

//     res.status(200).json(orders);
//   } catch (err) {
//     console.error("Error fetching orders:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // -----------------------------
// // GET DEALER ORDERS BY ID
// // -----------------------------
// export const getDealerOrders = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const orders = await Order.find({ dealerId: id })
//       .sort({ createdAt: -1 });

//     res.status(200).json(orders);
//   } catch (err) {
//     console.error("Error fetching dealer orders:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // -----------------------------
// // GET ORDERS BY DEALER INFO
// // -----------------------------
// export const getOrdersByDealerInfo = async (req, res) => {
//   try {
//     const { name, shopAddress } = req.query;

//     if (!name || !shopAddress) {
//       return res.status(400).json({
//         success: false,
//         error: "Name & Address are required"
//       });
//     }

//     const dealer = await Dealer.findOne({
//       name: { $regex: new RegExp(name, "i") },
//       shopAddress: { $regex: new RegExp(shopAddress, "i") }
//     });

//     if (!dealer) {
//       return res.status(404).json({
//         success: false,
//         error: "Dealer not found"
//       });
//     }

//     const orders = await Order.find({ dealerId: dealer._id })
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       dealer: {
//         _id: dealer._id,
//         name: dealer.name,
//         shopAddress: dealer.shopAddress,
//         contact: dealer.contact,
//         gstNumber: dealer.gstNumber,
//         image: dealer.image
//       },
//       count: orders.length,
//       orders
//     });

//   } catch (err) {
//     console.error("Error fetching orders by info:", err);
//     res.status(500).json({
//       success: false,
//       error: err.message
//     });
//   }
// };

// // -----------------------------
// // ✅ DELETE ORDER (ADMIN ONLY)
// // -----------------------------
// export const deleteOrder = async (req, res) => {
//   try {
//     const { id } = req.params;

//     console.log("Deleting order with ID:", id);

//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }

//     await Order.findByIdAndDelete(id);

//     res.status(200).json({
//       success: true,
//       message: "Order deleted successfully"
//     });

//   } catch (error) {
//     console.error("Error deleting order:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message
//     });
//   }
// };






















import Dealer from "../models/dealerModel.js";
import Order from "../models/orderModel.js";

// -----------------------------
// PLACE ORDER - FIXED FOR WEIGHT
// -----------------------------
export const placeOrder = async (req, res) => {
  try {
    const { dealerId, items } = req.body;

    if (!dealerId || !items || items.length === 0) {
      return res.status(400).json({ error: "Dealer ID and items are required" });
    }

    const dealer = await Dealer.findById(dealerId);
    if (!dealer) return res.status(404).json({ error: "Dealer not found" });

    // ✅ DEBUG: Check what's coming from frontend
    console.log("Received order items:", items);
    console.log("First item weight:", items[0]?.weight);

    // ✅ Calculate total amount with weight consideration
    const totalAmount = items.reduce(
      (sum, item) => sum + (item.price * item.qty),
      0
    );

    // ✅ Create order with ALL fields including weight
    const order = new Order({
      dealerId,
      address: dealer.shopAddress,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        qty: item.qty,
        weight: item.weight || "1kg", // ✅ Ensure weight is saved
        basePrice: item.basePrice || item.price // Optional
      })),
      totalAmount
    });

    const savedOrder = await order.save();
    
    // ✅ DEBUG: Check saved order
    console.log("Saved order items with weight:", savedOrder.items);

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder
    });

  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------
// GET ALL ORDERS - FIXED TO SHOW WEIGHT
// -----------------------------
export const getAllOrders = async (req, res) => {
  try {
    const { dealerId } = req.query;

    let query = {};
    if (dealerId) {
      query.dealerId = dealerId;
    }

    const orders = await Order.find(query)
      .populate("dealerId", "name contact shopAddress")
      .sort({ createdAt: -1 });

    // ✅ Ensure weight is included in response
    const ordersWithWeight = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map(item => ({
        ...item,
        weight: item.weight || "Not specified" // Default if missing
      }))
    }));

    res.status(200).json(ordersWithWeight);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------
// GET DEALER ORDERS BY ID - FIXED
// -----------------------------
export const getDealerOrders = async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await Order.find({ dealerId: id })
      .sort({ createdAt: -1 });

    // ✅ Ensure weight is included in response
    const ordersWithWeight = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map(item => ({
        ...item,
        weight: item.weight || "Not specified" // Default if missing
      }))
    }));

    res.status(200).json(ordersWithWeight);
  } catch (err) {
    console.error("Error fetching dealer orders:", err);
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------
// GET ORDERS BY DEALER INFO - FIXED
// -----------------------------
export const getOrdersByDealerInfo = async (req, res) => {
  try {
    const { name, shopAddress } = req.query;

    if (!name || !shopAddress) {
      return res.status(400).json({
        success: false,
        error: "Name & Address are required"
      });
    }

    const dealer = await Dealer.findOne({
      name: { $regex: new RegExp(name, "i") },
      shopAddress: { $regex: new RegExp(shopAddress, "i") }
    });

    if (!dealer) {
      return res.status(404).json({
        success: false,
        error: "Dealer not found"
      });
    }

    const orders = await Order.find({ dealerId: dealer._id })
      .sort({ createdAt: -1 });

    // ✅ Ensure weight is included in response
    const ordersWithWeight = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map(item => ({
        ...item,
        weight: item.weight || "Not specified" // Default if missing
      }))
    }));

    res.status(200).json({
      success: true,
      dealer: {
        _id: dealer._id,
        name: dealer.name,
        shopAddress: dealer.shopAddress,
        contact: dealer.contact,
        gstNumber: dealer.gstNumber,
        image: dealer.image
      },
      count: orders.length,
      orders: ordersWithWeight
    });

  } catch (err) {
    console.error("Error fetching orders by info:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// DELETE ORDER remains same...



// -----------------------------
// ✅ DELETE ORDER (ADMIN ONLY)
// -----------------------------
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Deleting order with ID:", id);

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    await Order.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};




