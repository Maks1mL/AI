import React, { memo, useCallback, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Head, useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
// Import icons from react-icons
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
  FiMessageSquare,
  FiImage,
  FiHeadphones,
  FiCreditCard,
  FiPackage,
  FiShield,
  FiList,
} from "react-icons/fi";

// --- Custom FormInput component moved outside --- //
const FormInput = memo(
  ({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    step,
    icon,
  }) => {
    // Use useCallback so that the handler stays stable between renders.
    const handleChange = useCallback(
      (e) => {
        onChange(name, e.target.value);
      },
      [name, onChange]
    );

    return (
      <div className="mb-4">
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor={name}
        >
          {label}
        </label>
        <div className="relative rounded-md shadow-sm">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            id={name}
            type={type}
            step={step}
            value={value}
            className={`block w-full ${icon ? "pl-10" : "pl-3"} pr-3 py-2 border ${
              error ? "border-red-300" : "border-gray-300"
            } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            onChange={handleChange}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

export default function AdminPlans({ plans }) {
  const { success, error } = usePage().props;

  // Create plan form state
  const {
    data: createData,
    setData: setCreateData,
    post,
    reset,
    errors: createErrors,
  } = useForm({
    name: "",
    price: "",
    chat_limit: "",
    image_limit: "",
    audio_limit: "",
    stripe_price_id: "",
  });

  // Edit plan form state
  const [editingPlan, setEditingPlan] = useState(null);
  const {
    data: editData,
    setData: setEditData,
    put,
    reset: resetEdit,
    errors: editErrors,
  } = useForm({
    name: "",
    price: "",
    chat_limit: "",
    image_limit: "",
    audio_limit: "",
    stripe_price_id: "",
  });

  // Use stable callbacks for the onChange for each form.
  const handleCreateChange = useCallback(
    (field, value) => {
      setCreateData(field, value);
    },
    [setCreateData]
  );

  const handleEditChange = useCallback(
    (field, value) => {
      setEditData(field, value);
    },
    [setEditData]
  );

  // Create new plan
  const handleCreate = (e) => {
    e.preventDefault();
    post(route("plans.store"), {
      preserveState: true,
      onSuccess: () => reset(),
      onError: (errors) => console.error("Create errors:", errors),
    });
  };

  // Populate edit form with selected plan data
  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setEditData({
      name: plan.name,
      price: plan.price,
      chat_limit: plan.chat_limit,
      image_limit: plan.image_limit,
      audio_limit: plan.audio_limit,
      stripe_price_id: plan.stripe_price_id || "",
    });
  };

  // Update existing plan
  const handleUpdate = (e) => {
    e.preventDefault();
    put(route("plans.update", editingPlan.id), {
      preserveState: true,
      onSuccess: () => {
        setEditingPlan(null);
        resetEdit();
      },
      onError: (errors) => console.error("Update errors:", errors),
    });
  };

  // Delete plan
  const handleDelete = (planId) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      Inertia.delete(route("plans.destroy", planId), {
        preserveState: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Head title="Manage Plan"/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-md shadow-sm">
            <div className="flex items-center">
              <FiCheckCircle className="h-5 w-5 text-green-400 mr-3" />
              <p className="text-sm font-medium">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-md shadow-sm">
            <div className="flex items-center">
              <FiAlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Forms Panel */}
          <div className="lg:col-span-1 order-1 lg:order-1">
            {/* Create Plan Form */}
            {!editingPlan ? (
              <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-blue-600">
                  <div className="flex items-center">
                    <FiPlus className="text-white mr-2" />
                    <h2 className="text-lg font-medium text-white">
                      Create New Plan
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-indigo-100">
                    Set up a new subscription offering
                  </p>
                </div>
                <div className="p-6">
                  <form onSubmit={handleCreate}>
                    <FormInput
                      label="Plan Name"
                      name="name"
                      value={createData.name}
                      onChange={handleCreateChange}
                      error={createErrors.name}
                      icon={<FiPackage className="h-4 w-4 text-gray-400" />}
                    />

                    <FormInput
                      label="Price ($)"
                      name="price"
                      type="number"
                      step="0.01"
                      value={createData.price}
                      onChange={handleCreateChange}
                      error={createErrors.price}
                      icon={<FiDollarSign className="h-4 w-4 text-gray-400" />}
                    />

                    <div className="border-t border-b border-gray-100 py-4 my-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                        <FiShield className="mr-1" />
                        Usage Limits
                      </h3>

                      <div className="space-y-3">
                        <FormInput
                          label="Chat Limit"
                          name="chat_limit"
                          type="number"
                          value={createData.chat_limit}
                          onChange={handleCreateChange}
                          error={createErrors.chat_limit}
                          icon={
                            <FiMessageSquare className="h-4 w-4 text-gray-400" />
                          }
                        />

                        <FormInput
                          label="Image Limit"
                          name="image_limit"
                          type="number"
                          value={createData.image_limit}
                          onChange={handleCreateChange}
                          error={createErrors.image_limit}
                          icon={<FiImage className="h-4 w-4 text-gray-400" />}
                        />

                        <FormInput
                          label="Audio Limit"
                          name="audio_limit"
                          type="number"
                          value={createData.audio_limit}
                          onChange={handleCreateChange}
                          error={createErrors.audio_limit}
                          icon={
                            <FiHeadphones className="h-4 w-4 text-gray-400" />
                          }
                        />
                      </div>
                    </div>

                    <FormInput
                      label="Stripe Price ID"
                      name="stripe_price_id"
                      value={createData.stripe_price_id}
                      onChange={handleCreateChange}
                      error={createErrors.stripe_price_id}
                      icon={
                        <FiCreditCard className="h-4 w-4 text-gray-400" />
                      }
                    />

                    <div className="mt-6">
                      <button
                        type="submit"
                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      >
                        <FiPlus className="mr-2" />
                        Create Plan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              // --- Edit Plan Form --- //
              <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-amber-600 to-orange-600">
                  <div className="flex items-center">
                    <FiEdit2 className="text-white mr-2" />
                    <h2 className="text-lg font-medium text-white">Edit Plan</h2>
                  </div>
                  <p className="mt-1 text-sm text-amber-100">
                    Modifying: {editingPlan.name}
                  </p>
                </div>
                <div className="p-6">
                  <form onSubmit={handleUpdate}>
                    <FormInput
                      label="Plan Name"
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      error={editErrors.name}
                      icon={<FiPackage className="h-4 w-4 text-gray-400" />}
                    />

                    <FormInput
                      label="Price ($)"
                      name="price"
                      type="number"
                      step="0.01"
                      value={editData.price}
                      onChange={handleEditChange}
                      error={editErrors.price}
                      icon={<FiDollarSign className="h-4 w-4 text-gray-400" />}
                    />

                    <div className="border-t border-b border-gray-100 py-4 my-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                        <FiShield className="mr-1" />
                        Usage Limits
                      </h3>

                      <div className="space-y-3">
                        <FormInput
                          label="Chat Limit"
                          name="chat_limit"
                          type="number"
                          value={editData.chat_limit}
                          onChange={handleEditChange}
                          error={editErrors.chat_limit}
                          icon={
                            <FiMessageSquare className="h-4 w-4 text-gray-400" />
                          }
                        />

                        <FormInput
                          label="Image Limit"
                          name="image_limit"
                          type="number"
                          value={editData.image_limit}
                          onChange={handleEditChange}
                          error={editErrors.image_limit}
                          icon={<FiImage className="h-4 w-4 text-gray-400" />}
                        />

                        <FormInput
                          label="Audio Limit"
                          name="audio_limit"
                          type="number"
                          value={editData.audio_limit}
                          onChange={handleEditChange}
                          error={editErrors.audio_limit}
                          icon={
                            <FiHeadphones className="h-4 w-4 text-gray-400" />
                          }
                        />
                      </div>
                    </div>

                    <FormInput
                      label="Stripe Price ID"
                      name="stripe_price_id"
                      value={editData.stripe_price_id}
                      onChange={handleEditChange}
                      error={editErrors.stripe_price_id}
                      icon={<FiCreditCard className="h-4 w-4 text-gray-400" />}
                    />

                    <div className="mt-6 flex space-x-3">
                      <button
                        type="submit"
                        className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                      >
                        <FiEdit2 className="mr-2" />
                        Update Plan
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPlan(null);
                          resetEdit();
                        }}
                        className="flex-1 flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Quick Tips/Help Card */}
            <div className="mt-6 bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <h3 className="font-medium text-gray-700 text-sm flex items-center">
                  <FiList className="mr-2" />
                  Tips for Plan Management
                </h3>
              </div>
              <div className="p-4 text-sm">
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <span className="text-xs font-medium text-blue-800">
                        1
                      </span>
                    </div>
                    Set competitive pricing based on feature limits
                  </li>
                  <li className="flex items-center">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <span className="text-xs font-medium text-blue-800">
                        2
                      </span>
                    </div>
                    Add the Stripe price ID to enable billing
                  </li>
                  <li className="flex items-center">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <span className="text-xs font-medium text-blue-800">
                        3
                      </span>
                    </div>
                    Higher limits should correlate with higher pricing
                  </li>
                  <li className="flex items-center">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <span className="text-xs font-medium text-blue-800">
                        4
                      </span>
                    </div>
                    Ensure plan names clearly communicate their value
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Plans List Panel */}
          <div className="lg:col-span-2 order-2 lg:order-2">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-800 to-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-white flex items-center">
                      <FiPackage className="mr-2" />
                      All Plans
                    </h2>
                    <p className="mt-1 text-sm text-gray-300">
                      Manage your subscription plan offerings
                    </p>
                  </div>
                  <div className="bg-gray-900 bg-opacity-30 rounded-md px-3 py-1">
                    <span className="text-sm text-gray-300">
                      {plans.length} Plans Available
                    </span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Plan Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Usage Limits
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {plans.map((plan) => (
                      <tr
                        key={plan.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-3 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-600">
                              <FiPackage size={18} />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {plan.name}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 flex items-center">
                                <FiCreditCard className="mr-1" size={12} />
                                {plan.stripe_price_id
                                  ? plan.stripe_price_id
                                  : "Not connected to Stripe"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex justify-center space-x-6">
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1 flex items-center justify-center">
                                <FiMessageSquare className="mr-1" size={12} />
                                Chats
                              </div>
                              <span className="text-sm font-medium text-gray-800">
                                {plan.chat_limit}
                              </span>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1 flex items-center justify-center">
                                <FiImage className="mr-1" size={12} />
                                Images
                              </div>
                              <span className="text-sm font-medium text-gray-800">
                                {plan.image_limit}
                              </span>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500 mb-1 flex items-center justify-center">
                                <FiHeadphones className="mr-1" size={12} />
                                Audio
                              </div>
                              <span className="text-sm font-medium text-gray-800">
                                {plan.audio_limit}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-center">
                          <div className="text-lg font-semibold text-gray-900">
                            ${parseFloat(plan.price).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(plan)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                              <FiEdit2 className="mr-1" size={12} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(plan.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                            >
                              <FiTrash2 className="mr-1" size={12} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {plans.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <FiPackage className="h-10 w-10 text-gray-400 mb-3" />
                            <p className="text-sm text-gray-500">
                              No plans found. Create your first plan to get started.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* End Plans List */}
        </div>
      </div>
    </div>
  );
}
