"use client";

import React, { useState } from "react";
import PurchaseSummary from "./PurchaseSummary";
import ShippingForm from "./ShippingForm";
import PaymentForm from "./PaymentForm";
import CheckoutConfirmation from "./CheckoutConfirmation";

interface CheckoutFormProps {
  item: Cat;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ item }) => {
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expirationMonth: "",
    expirationYear: "",
    cvv: "",
  });
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [orderPlaced, setOrderPlaced] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!shippingAddress.name) newErrors.name = "Full name is required";
    if (!shippingAddress.addressLine1)
      newErrors.addressLine1 = "Street address is required";
    if (!shippingAddress.city) newErrors.city = "City is required";
    if (!shippingAddress.state) newErrors.state = "State/Province is required";
    if (!shippingAddress.postalCode)
      newErrors.postalCode = "Postal code is required";
    if (!shippingAddress.country) newErrors.country = "Country is required";
    if (!paymentDetails.cardNumber)
      newErrors.cardNumber = "Card number is required";
    if (!paymentDetails.expirationMonth)
      newErrors.expirationMonth = "Expiration month is required";
    if (!paymentDetails.expirationYear)
      newErrors.expirationYear = "Expiration year is required";
    if (!paymentDetails.cvv) newErrors.cvv = "CVV is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    setFormStatus({ type: null, message: "" });

    // try {
    //   const response = await fetch(
    //     "http://localhost:8082/Payment/PaymentServlet",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       credentials: "include",
    //       body: JSON.stringify({
    //         itemId: item.itemId,
    //         username: currentUser,
    //       }),
    //     }
    //   );

    //   if (response.ok) {
    //     setFormStatus({
    //       type: "success",
    //       message: "Purchase completed successfully!",
    //     });
    //     setOrderPlaced(true);
    //   } else {
    //     const errorData = await response.json();
    //     setFormStatus({
    //       type: "error",
    //       message: errorData.message || "An error occurred. Please try again.",
    //     });
    //   }
    // } catch (error: any) {
    //   setFormStatus({
    //     type: "error",
    //     message: error.message || "An error occurred. Please try again.",
    //   });
    // } finally {
    //   setIsSubmitting(false);
    // }

    setTimeout(() => {
      setFormStatus({
        type: "success",
        message: "Purchase completed successfully!",
      });
      setOrderPlaced(true);
      setIsSubmitting(false);
    }, 2000);
  };

  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  if (orderPlaced) {
    return <CheckoutConfirmation item={item} />;
  }

  return (
    <div className="flex items-center my-auto w-full xl:p-0 p-4 sm:p-8 overflow-y-auto mx-auto">
      <div className="w-full max-w-3xl max-xl:rounded-lg xl:max-w-4xl max-xl:mx-auto p-6 z-10 sm:p-8 xl:px-28 lg:p-12 xl:py-20 bg-cloud-white to-cloud-white/75 via-cloud-white/60 from-white/90 border-r-2 border-sage-green/50 backdrop-blur-sm">
        {/* Item Details */}
        <PurchaseSummary item={item} />

        <h2 className="text-2xl mt-8 xl:mt-12 md:text-3xl xl:text-4xl font-bold text-sage-green mb-4">
          Complete Your Purchase
        </h2>
        <hr className="border-t-2 border-slate-200" />
        <form onSubmit={handleSubmit} className="mt-8 pl-1 pr-4">
          <ShippingForm
            shippingAddress={shippingAddress}
            errors={errors}
            handleShippingChange={handleShippingChange}
          />
          <hr className="border-t-2 border-slate-200" />
          <PaymentForm
            paymentDetails={paymentDetails}
            errors={errors}
            handlePaymentChange={handlePaymentChange}
          />
          {formStatus.type === "error" && (
            <div className="text-red-500 mb-4">{formStatus.message}</div>
          )}
          {formStatus.type === "success" && (
            <div className="text-sage-green mb-4">{formStatus.message}</div>
          )}
          <button
            type="submit"
            className="bg-sunset-orange text-cloud-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-80 hover:scale-105 transition-transform duration-300 disabled:opacity-50 flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              "Complete Purchase"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
