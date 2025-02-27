import React from "react";
import PurchaseSummary from "./PurchaseSummary";

interface CheckoutConfirmationProps {
  item: Cat;
}

const CheckoutConfirmation: React.FC<CheckoutConfirmationProps> = ({
  item,
}) => {
  return (
    <div className="flex items-center h-full my-auto w-full xl:p-0 p-4 sm:p-8 overflow-y-auto mx-auto">
      <div className="w-full flex items-center justify-center h-full max-w-3xl max-xl:rounded-lg xl:max-w-4xl max-xl:mx-auto flex-col p-6 z-10 sm:p-8 xl:px-28 lg:p-12 xl:py-20 bg-cloud-white to-cloud-white/75 via-cloud-white/60 from-white/90 border-r-2 border-sage-green/50 backdrop-blur-sm">
        <div className="text-sage-green mb-8 text-lg font-semibold text-center">
          Your order has been placed successfully! 🎉
        </div>
        <PurchaseSummary item={item} />
      </div>
    </div>
  );
};

export default CheckoutConfirmation;
