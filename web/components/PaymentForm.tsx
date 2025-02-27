import React from "react";

interface PaymentFormProps {
  paymentDetails: {
    cardNumber: string;
    expirationMonth: string;
    expirationYear: string;
    cvv: string;
  };
  errors: { [key: string]: string };
  handlePaymentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentDetails,
  errors,
  handlePaymentChange,
}) => {
  return (
    <div className="mt-4">
      <h3 className="text-2xl font-semibold text-slate-gray mb-4">
        Payment Details
      </h3>
      <div className="mb-4 flex flex-col gap-2">
        <label
          htmlFor="cardNumber"
          className="block text-midnight-blue text-sm font-medium"
        >
          Card Number
        </label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          placeholder="Enter your card number"
          className={`border border-slate-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sage-green placeholder:text-slate-400 ${
            errors.cardNumber ? "border-red-500" : ""
          }`}
          value={paymentDetails.cardNumber}
          onChange={handlePaymentChange}
          aria-label="Card Number"
          required
        />
        {errors.cardNumber && (
          <div className="text-red-500 text-sm">{errors.cardNumber}</div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="expirationMonth"
              className="block text-midnight-blue text-sm font-medium mb-2"
            >
              Expiration Month
            </label>
            <input
              type="text"
              id="expirationMonth"
              name="expirationMonth"
              placeholder="MM"
              className={`border border-slate-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sage-green placeholder:text-slate-400 ${
                errors.expirationMonth ? "border-red-500" : ""
              }`}
              value={paymentDetails.expirationMonth}
              onChange={handlePaymentChange}
              aria-label="Expiration Month"
              required
            />
            {errors.expirationMonth && (
              <div className="text-red-500 text-sm">
                {errors.expirationMonth}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="expirationYear"
              className="block text-midnight-blue text-sm font-medium mb-2"
            >
              Expiration Year
            </label>
            <input
              type="text"
              id="expirationYear"
              name="expirationYear"
              placeholder="YYYY"
              className={`border border-slate-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sage-green placeholder:text-slate-400 ${
                errors.expirationYear ? "border-red-500" : ""
              }`}
              value={paymentDetails.expirationYear}
              onChange={handlePaymentChange}
              aria-label="Expiration Year"
              required
            />
            {errors.expirationYear && (
              <div className="text-red-500 text-sm">
                {errors.expirationYear}
              </div>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="cvv"
            className="block text-midnight-blue text-sm font-medium mb-2"
          >
            CVV
          </label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            placeholder="Enter your CVV"
            className={`border border-slate-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sage-green placeholder:text-slate-400 ${
              errors.cvv ? "border-red-500" : ""
            }`}
            value={paymentDetails.cvv}
            onChange={handlePaymentChange}
            aria-label="CVV"
            required
          />
          {errors.cvv && (
            <div className="text-red-500 text-sm">{errors.cvv}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
