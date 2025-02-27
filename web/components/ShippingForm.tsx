import React from "react";

interface ShippingFormProps {
  shippingAddress: {
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  errors: { [key: string]: string };
  handleShippingChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({
  shippingAddress,
  errors,
  handleShippingChange,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold text-slate-gray mb-4">
        Shipping Address
      </h3>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-midnight-blue text-sm font-medium mb-2"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your full name"
          className={`border border-slate-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sage-green placeholder:text-slate-400 ${
            errors.name ? "border-red-500" : ""
          }`}
          value={shippingAddress.name}
          onChange={handleShippingChange}
          aria-label="Full Name"
          required
        />
        {errors.name && (
          <div className="text-red-500 text-sm">{errors.name}</div>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="addressLine1"
          className="block text-midnight-blue text-sm font-medium mb-2"
        >
          Street Address
        </label>
        <input
          type="text"
          id="addressLine1"
          name="addressLine1"
          placeholder="Enter your street address"
          className={`border border-slate-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sage-green placeholder:text-slate-400 ${
            errors.addressLine1 ? "border-red-500" : ""
          }`}
          value={shippingAddress.addressLine1}
          onChange={handleShippingChange}
          aria-label="Street Address"
          required
        />
        {errors.addressLine1 && (
          <div className="text-red-500 text-sm">{errors.addressLine1}</div>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="addressLine2"
          className="block text-midnight-blue text-sm font-medium mb-2"
        >
          Apartment, Suite, etc. (optional)
        </label>
        <input
          type="text"
          id="addressLine2"
          name="addressLine2"
          placeholder="Enter your apartment, suite, etc. (optional)"
          className="border border-slate-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sage-green placeholder:text-slate-400"
          value={shippingAddress.addressLine2}
          onChange={handleShippingChange}
          aria-label="Apartment, Suite, etc. (optional)"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="city"
          className="block text-midnight-blue text-sm font-medium mb-2"
        >
          City
        </label>
        <input
          type="text"
          id="city"
          name="city"
          placeholder="Enter your city"
          className={`border border-slate-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sage-green placeholder:text-slate-400 ${
            errors.city ? "border-red-500" : ""
          }`}
          value={shippingAddress.city}
          onChange={handleShippingChange}
          aria-label="City"
          required
        />
        {errors.city && (
          <div className="text-red-500 text-sm">{errors.city}</div>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="state"
          className="block text-midnight-blue text-sm font-medium mb-2"
        >
          State/Province
        </label>
        <input
          type="text"
          id="state"
          name="state"
          placeholder="Enter your state/province"
          className={`border border-slate-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sage-green placeholder:text-slate-400 ${
            errors.state ? "border-red-500" : ""
          }`}
          value={shippingAddress.state}
          onChange={handleShippingChange}
          aria-label="State/Province"
          required
        />
        {errors.state && (
          <div className="text-red-500 text-sm">{errors.state}</div>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="postalCode"
          className="block text-midnight-blue text-sm font-medium mb-2"
        >
          Postal Code
        </label>
        <input
          type="text"
          id="postalCode"
          name="postalCode"
          placeholder="Enter your postal code"
          className={`border border-slate-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sage-green placeholder:text-slate-400 ${
            errors.postalCode ? "border-red-500" : ""
          }`}
          value={shippingAddress.postalCode}
          onChange={handleShippingChange}
          aria-label="Postal Code"
          required
        />
        {errors.postalCode && (
          <div className="text-red-500 text-sm">{errors.postalCode}</div>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="country"
          className="block text-midnight-blue text-sm font-medium mb-2"
        >
          Country
        </label>
        <select
          id="country"
          name="country"
          className={`border border-slate-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sage-green placeholder:text-slate-400 ${
            errors.country ? "border-red-500" : ""
          }`}
          value={shippingAddress.country}
          onChange={handleShippingChange}
          aria-label="Country"
          required
        >
          <option value="">Select Country</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="UK">United Kingdom</option>
          {/* Add more countries as needed */}
        </select>
        {errors.country && (
          <div className="text-red-500 text-sm">{errors.country}</div>
        )}
      </div>
    </div>
  );
};

export default ShippingForm;
