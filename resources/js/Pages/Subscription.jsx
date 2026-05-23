import React from "react";
import SubscriptionTable from "./SubscriptionTable";
import { FaCreditCard, FaFileInvoice } from "react-icons/fa";
import InvoiceTable from "./InvoiceTable";

export default function Subscription({ invoices, subscriptions, user }) {

    return (
        <div className="max-w-7xl mx-auto my-8 md:my-12">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <Section
                    title={
                        user.id === 1
                            ? "All Subscriptions"
                            : "Your Subscriptions"
                    }
                    icon={<FaCreditCard className="text-indigo-600" />}
                >
                    {subscriptions?.length > 0 ? (
                        <SubscriptionTable
                            pageConfig={1}
                            setPageConfig={1}
                            headers={[
                                "ID",
                                "Plan",
                                "Price",
                                "Starts At",
                                "Ends At",
                                "Status",
                            ]}
                        />
                    ) : (
                        <EmptyState
                            message="No subscriptions found."
                            icon={
                                <FaCreditCard className="w-12 h-12 text-gray-300" />
                            }
                        />
                    )}
                </Section>

                <Section
                    title={user.id === 1 ? "All Invoices" : "Your Invoices"}
                    icon={<FaFileInvoice className="text-indigo-600" />}
                >
                    {invoices.length > 0 ? (
                        <InvoiceTable
                            pageConfig={1}
                            setPageConfig={1}
                            headers={["Invoice ID", "Amount", "Date", "Action"]}
                        />
                    ) : (
                        <EmptyState
                            message="No invoices found."
                            icon={
                                <FaFileInvoice className="w-12 h-12 text-gray-300" />
                            }
                        />
                    )}
                </Section>
            </div>
        </div>
    );
}

/* Section Wrapper */
const Section = ({ title, children, icon }) => (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden max-h-[400px]">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center">
            <div className="p-2 rounded-lg bg-indigo-50 mr-3">{icon}</div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="p-6 overflow-y-auto max-h-[300px]">{children}</div>
    </div>
);

/* Empty State Component */
const EmptyState = ({ message, icon }) => (
    <div className="text-center py-12">
        <div className="flex justify-center mb-4">{icon}</div>
        <p className="text-gray-500">{message}</p>
    </div>
);
