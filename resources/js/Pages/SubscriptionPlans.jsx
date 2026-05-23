import React, { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaArrowRight, 
  FaRobot, 
  FaImage, 
  FaHeadphones,
  FaCheck,
  FaCreditCard,
  FaLock,
  FaCcStripe
} from "react-icons/fa";
import { Head } from "@inertiajs/react";

const SubscriptionPlans = ({ plans, activeSubscription, stripeKey }) => {
  const stripePromise = loadStripe(stripeKey);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("error")) {
      setErrorMessage(params.get("error"));
    }
  }, []);

  const handlePurchase = async (plan) => {
    setLoadingPlanId(plan.id);
    setMessage("");
    try {
      const response = await axios.post("/subscribe", {
        plan_id: plan.id,
      });
      if (plan.price > 0) {
        const { checkout_session_id } = response.data;
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: checkout_session_id,
        });
        if (error) {
          setMessage(error.message);
        }
      } else {
        setMessage("Subscription activated successfully!");
      }
    } catch (error) {
      console.log(error);
      setMessage(
        error.response?.data?.error ||
        "Error purchasing subscription. Please try again."
      );
    }
    setLoadingPlanId(null);
  };

  // Helper to get feature description based on plan type
  const getFeatureDescription = (planName) => {
    switch(planName.toLowerCase()) {
      case "basic":
        return "Essential AI tools for individuals";
      case "pro":
        return "Advanced features for professionals";
      case "enterprise":
        return "Ultimate AI solution for businesses";
      default:
        return "Customized AI solutions";
    }
  };

  return (
    <div className="bg-white">
      <Head title="Plan"/>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Elevate Your Experience with AI
          </h1>
          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto">
            Choose the perfect plan that aligns with your goals and transform the way you work.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl -mt-10">
        {/* Error Message */}
        {errorMessage && (
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-8 flex items-center shadow-md">
            <FaExclamationTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Active Subscription Banner */}
        {activeSubscription && (
          <div className="max-w-3xl mx-auto bg-white rounded-lg p-6 mb-12 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <FaCheckCircle className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Active Subscription
                  </h2>
                  <p className="text-gray-600">Your subscription is currently active</p>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 rounded-lg">
                <p className="text-sm text-gray-500">Current Plan</p>
                <p className="text-lg font-semibold text-indigo-700">{activeSubscription.plan.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Expires: {new Date(activeSubscription.ends_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* No Active Subscription Message */}
        {!activeSubscription && (
          <div className="max-w-lg mx-auto text-center bg-blue-50 rounded-lg p-4 mb-10 shadow-sm">
            <p className="text-blue-700">
              You don't have an active subscription. Select a plan below to get started.
            </p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl overflow-hidden ${
                plan.name === "Pro" 
                  ? "ring-2 ring-indigo-500 transform md:-translate-y-4" 
                  : "border border-gray-200"
              } shadow-lg hover:shadow-xl transition duration-300`}
            >
              {plan.name === "Pro" && (
                <div className="bg-indigo-600 text-white text-center py-2 font-medium">
                  MOST POPULAR
                </div>
              )}
              <div className="p-8">
                {/* Plan Name & Price */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h2>
                  <p className="text-gray-500 mb-6">
                    {getFeatureDescription(plan.name)}
                  </p>
                  <div className="flex justify-center items-baseline">
                    <span className="text-5xl font-extrabold text-gray-900">
                      {plan.price > 0 ? `$${plan.price}` : "Free"}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-500 ml-1 text-xl">/month</span>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="w-16 h-1 bg-indigo-100 mx-auto mb-8"></div>

                {/* Feature List */}
                <ul className="space-y-4 mb-8">
                  <li className="flex">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <FaRobot className="text-indigo-600 w-3 h-3" />
                    </div>
                    <span className="text-gray-700">
                      <span className="font-semibold">{plan.chat_limit}</span> AI Conversations
                    </span>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <FaImage className="text-indigo-600 w-3 h-3" />
                    </div>
                    <span className="text-gray-700">
                      <span className="font-semibold">{plan.image_limit}</span> Image Generations
                    </span>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <FaHeadphones className="text-indigo-600 w-3 h-3" />
                    </div>
                    <span className="text-gray-700">
                      <span className="font-semibold">{plan.audio_limit}</span> Audio Conversions
                    </span>
                  </li>
                  {plan.name !== "Basic" && (
                    <li className="flex">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <FaCheck className="text-indigo-600 w-3 h-3" />
                      </div>
                      <span className="text-gray-700">Priority Support</span>
                    </li>
                  )}
                  {plan.name === "Enterprise" && (
                    <li className="flex">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <FaCheck className="text-indigo-600 w-3 h-3" />
                      </div>
                      <span className="text-gray-700">Custom AI Integration</span>
                    </li>
                  )}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handlePurchase(plan)}
                  disabled={loadingPlanId === plan.id}
                  className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center transition-colors ${
                    plan.name === "Pro"
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loadingPlanId === plan.id ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      {plan.price > 0 ? "Select Plan" : "Start Free"} 
                      <FaArrowRight className="ml-2 w-4 h-4" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Status Message */}
        {message && (
          <div className={`max-w-md mx-auto p-4 rounded-lg text-center ${
            message.includes("successfully") 
              ? "bg-green-50 border border-green-200 text-green-800" 
              : "bg-red-50 border border-red-200 text-red-700"
          } shadow-md mb-16`}>
            <div className="flex items-center justify-center">
              {message.includes("successfully") ? (
                <FaCheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <FaExclamationTriangle className="w-5 h-5 mr-2" />
              )}
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* Trust Signals */}
        <div className="max-w-4xl mx-auto mb-16 border-t border-gray-200 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <FaLock className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Processing</h3>
              <p className="text-gray-600 text-sm">Your information is protected by enterprise-grade encryption</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <FaCreditCard className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Flexible Billing</h3>
              <p className="text-gray-600 text-sm">Cancel or change your plan anytime with no penalties</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <FaCheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Satisfaction Guarantee</h3>
              <p className="text-gray-600 text-sm">Try risk-free with our 14-day money-back guarantee</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="text-center pb-16 border-t border-gray-200 pt-16">
          <p className="text-sm text-gray-500 mb-4">Secure Payment Methods</p>
          <div className="flex justify-center space-x-3">
            <div ><FaCcStripe className="w-12 h-8 text-indigo-600 rounded"/></div>
            <div ><FaCcStripe className="w-12 h-8 text-indigo-600 rounded"/></div>
            <div ><FaCcStripe className="w-12 h-8 text-indigo-600 rounded"/></div>
            <div ><FaCcStripe className="w-12 h-8 text-indigo-600 rounded"/></div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;