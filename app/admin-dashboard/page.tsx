"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface PaymentDetails {
  amount: number;
  user: {
    name: string;
    email: string;
    contact: string;
  };
  plan: {
    type: string;
    price: number;
    duration: string;
  };
  paymentResponse: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  };
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function AdminDashboard() {
  const [payments, setPayments] = useState<PaymentDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch payments from Firebase
  const fetchPayments = async () => {
    try {
      const q = query(collection(db, "payments"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const paymentList: PaymentDetails[] = [];
      querySnapshot.forEach((doc) => {
        paymentList.push(doc.data() as PaymentDetails);
      });
      setPayments(paymentList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payments: ", error);
      toast.error("Failed to load transactions");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl font-semibold">Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <ToastContainer />
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Admin Dashboard - Transactions
      </h2>

      {payments.length === 0 ? (
        <div className="text-center text-lg font-medium text-gray-700">
          No transactions found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {payments.map((payment, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 transition-transform transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {payment.user.name} ({payment.user.email})
              </h3>
              <p className="text-gray-700 mb-1">
                Contact: {payment.user.contact}
              </p>
              <p className="text-gray-700 mb-1">
                Plan: {payment.plan.type} - ₹{payment.plan.price} for{" "}
                {payment.plan.duration}
              </p>
              <p className="text-gray-700 mb-1">
                Payment ID: {payment.paymentResponse.razorpay_payment_id}
              </p>
              <p className="text-gray-700 mb-1">
                Order ID: {payment.paymentResponse.razorpay_order_id}
              </p>
                <p className="text-green-600 text-sm mt-4">
                  Created At: {new Date(payment.createdAt.seconds * 1000).toLocaleString()}
                </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
