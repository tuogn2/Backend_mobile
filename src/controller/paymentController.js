const crypto = require("crypto");
const axios = require("axios");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User");

const VNPAY = {
  // Your VNPay Merchant Info
  merchantId: "LCFS6OPB",
  secureKey: "T9ZNNTS78J4GGU6L7SUVQ6E6EUGHSX92",
  paymentUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html", // Sandbox URL (use production URL when ready)
  returnUrl: "http://yourdomain.com/payment/return" // Your return URL to handle the response
};

class PaymentController {

  // Create a new payment
  async createPayment(req, res) {
    try {
      const { userId, roomId, bookingId, paymentMethod, amount ,status} = req.body;

      // Check existence of user, room, and booking
      const user = await User.findById(userId);
      const room = await Room.findById(roomId);
      const booking = await Booking.findById(bookingId);

      if (!user || !room || !booking) {
        return res.status(404).json({ message: "User, room, or booking does not exist." });
      }

      // If the payment method is VNPay, create a VNPay payment request
      if (paymentMethod === "vnpay") {
        const vnpayParams = {
          vnp_Version: "2.1.0",
          vnp_TmnCode: VNPAY.merchantId,
          vnp_TransactionNo: new Date().getTime(),
          vnp_OrderInfo: `Booking ${bookingId} payment`,
          vnp_OrderType: "billpayment",
          vnp_Amount: amount * 100, // VNPay expects amount in "VND" (dong)
          vnp_Locale: "vn",
          vnp_ReturnUrl: VNPAY.returnUrl,
          vnp_TxnRef: new Date().getTime().toString(),
          vnp_CreateDate: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        };

        // Generate the VNPAY signature
        const signData = Object.keys(vnpayParams)
          .sort()
          .map(key => `${key}=${vnpayParams[key]}`)
          .join('&');
        
        const secureHash = crypto
          .createHmac('sha512', VNPAY.secureKey)
          .update(signData)
          .digest('hex');

        // Add the signature to the request
        vnpayParams.vnp_SecureHash = secureHash;

        // Redirect the user to VNPay's payment page
        const queryString = Object.keys(vnpayParams)
          .map(key => `${key}=${encodeURIComponent(vnpayParams[key])}`)
          .join('&');

        const paymentUrl = `${VNPAY.paymentUrl}?${queryString}`;

        // Create a payment record in your database
        const newPayment = new Payment({
          userId,
          roomId,
          bookingId,
          paymentMethod: "vnpay",
          amount,
          status: "pending", // Status will be updated after response from VNPay
        });

        // Save payment info
        await newPayment.save();

        res.redirect(paymentUrl); // Redirect the user to VNPay
      } else {
        // Handle other payment methods (e.g., credit card, cash)
        const newPayment = new Payment({
          userId,
          roomId,
          bookingId,
          paymentMethod,
          amount,
          status,
        });
        await newPayment.save();
        res.status(201).json({ message: "Payment created successfully!", payment: newPayment });
      }
    } catch (error) {
      res.status(500).json({ message:  error.message  });
    }
  }

  // Handle VNPay callback after payment (return URL)
  async handleVNPayResponse(req, res) {
    try {
      const vnpayResponse = req.query;
      const vnpaySecureHash = vnpayResponse.vnp_SecureHash;
      const secureKey = VNPAY.secureKey;
      const signatureData = Object.keys(vnpayResponse)
        .filter(key => key !== 'vnp_SecureHash')
        .sort()
        .map(key => `${key}=${vnpayResponse[key]}`)
        .join('&');

      const secureHash = crypto
        .createHmac('sha512', secureKey)
        .update(signatureData)
        .digest('hex');

      if (vnpaySecureHash === secureHash) {
        // Valid response from VNPay
        const { vnp_TxnRef, vnp_Amount, vnp_ResponseCode } = vnpayResponse;
        
        const payment = await Payment.findOne({ paymentMethod: "vnpay", status: "pending", _id: vnp_TxnRef });

        if (!payment) {
          return res.status(400).json({ message: "Payment not found or already processed" });
        }

        // Check if the payment was successful
        if (vnp_ResponseCode === "00") {
          payment.status = "completed"; // Mark as completed
        } else {
          payment.status = "failed"; // Mark as failed
        }

        // Update payment status
        await payment.save();

        res.status(200).json({ message: "Payment response processed successfully", payment });
      } else {
        // Invalid response from VNPay
        res.status(400).json({ message: "Invalid signature or response from VNPay" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

module.exports = new PaymentController();
