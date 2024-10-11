"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Modal from "@/components/Modal";
import { db } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import Card from "@/components/Card";
import { cardValue } from "@/utils/data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import Image from "next/image";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CardData {
  image: JSX.Element;
  passType: string;
  price: string;
  duration: string;
  static: string[];
}

interface UserDetails {
  name: string;
  email: string;
  contact: string;
}

export default function Home() {
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const router = useRouter();

  const handlePayment = async (amount: number, userDetails: UserDetails) => {
    setIsProcessing(selectedCardIndex);
    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      toast.info("Payment is in progress. Don't close.");
      const options = {
        key: process.env.NEXT_PUBLIC_RZP_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "Payment Gateway",
        description: "Subscription Payment",
        order_id: data.orderId,
        handler: async function (response: any) {
          if (selectedCardIndex !== null) {
            const paymentDetails = {
              amount,
              user: userDetails,
              plan: {
                type: cardValue[selectedCardIndex].passType,
                price: cardValue[selectedCardIndex].price,
                duration: cardValue[selectedCardIndex].duration,
              },
              paymentResponse: response,
              createdAt: new Date(),
            };

            try {
              await setDoc(doc(db, "payments", response.razorpay_order_id), paymentDetails);
              toast.success("Payment Successful!");
            } catch (error) {
              console.error("Error adding document: ", error);
              toast.error("Error saving payment details!"); // Notify error
            }
          } else {
            toast.error("No selected card index available"); // Notify error
          }

          router.push("/dashboard");
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.log("Payment Error", err);
      toast.error("Payment Error! Please try again."); // Notify error
    } finally {
      setIsProcessing(null);
    }
  };

  const handleChooseClick = (index: number) => {
    setSelectedCardIndex(index);
    setModalOpen(true);
  };

  const handleModalSubmit = (name: string, email: string, contact: string) => {
    const newUserDetails: UserDetails = { name, email, contact };
    if (selectedCardIndex !== null) {
      const selectedPrice = Number(cardValue[selectedCardIndex].price);
      handlePayment(selectedPrice, newUserDetails);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="relative bg-black">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        <Image
          src="/card.png"
          width={1000}
          height={800}
          alt="background image for highlight pricing component in full screen"
          className="w-full h-screen object-cover hidden lg:inline-block opacity-50"
        />
        <div className="absolute top-5 right-5 z-50">
          <Link href="/admin-login" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded">
            Admin Login
          </Link>
        </div>
        <div className="bg-black font-sans lg:bg-transparent flex flex-col lg:flex-row absolute justify-center lg:top-1/2 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 px-5 xl:px-0 py-8 lg:py-0 w-full gap-6 items-center lg:items-stretch">
          {cardValue.map((data: CardData, index: number) => (
            <Card
              key={index}
              index={index}
              data={data}
              isProcessing={isProcessing}
              onChoose={handleChooseClick}
            />
          ))}
        </div>
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      </div>
    </>
  );
}
