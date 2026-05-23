import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, Link, router } from "@inertiajs/react";
import { useState } from "react";
import SubscriptionTable from "./SubscriptionTable";
import InvoiceTable from "./InvoiceTable";
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaDollarSign, 
  FaCommentAlt, 
  FaImage, 
  FaHeadphones,
  FaFileInvoice,
  FaCreditCard
} from "react-icons/fa";
import ServiceCards from "@/Components/ServiceCards";

export default function Dashboard() {
    const {
        invoices,
        subscriptions,
        totalSubscriptions,
        selectedMonth,
        totalRevenue,
        totalTextMessages,
        totalAudioMessages,
        totalAudioChatlimit,
        totalImageMessages,
        totalTextChatlimit,
        totalImageChatlimit,
    } = usePage().props;

    const user = usePage().props.auth.user;

    const useQueryParams = () => {
        const page = usePage();
        return new URLSearchParams(page.url.split('?')[1]);
    };
    const queryParams = useQueryParams();
    const subPage = queryParams.get('subPage') || 1;
    const invPage = queryParams.get('invPage') || 1;

    const [pageConfig, setPageConfig] = useState({
        subPage: Number(subPage),
        invPage: Number(invPage),
        month: selectedMonth,
    });

    const handleMonthChange = (e) => {
        setPageConfig((prevConfig) => {
            return { ...prevConfig, month: e.target.value };
        });
        router.get(`/dashboard`, { month: e.target.value, subPage: pageConfig.subPage, invPage:pageConfig.invPage }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="bg-gradient-to-b from-indigo-50 to-white xl:h-[100vh] py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div className="mb-4 md:mb-0">
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                            <p className="text-gray-600 mt-1">
                                {new Date().toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </p>
                        </div>

                        {user.id === 1 && (
                            <div className="bg-white shadow-sm rounded-lg p-3 flex items-center">
                                <FaCalendarAlt className="text-indigo-500 mr-2" />
                                <label className="font-medium text-gray-700 mr-2">Filter Period:</label>
                                <input
                                    type="month"
                                    value={pageConfig.month}
                                    onChange={handleMonthChange}
                                    className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                            </div>
                        )}
                    </div>

                    {/* Metrics */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${user.id == 1 ? "lg:grid-cols-5 xl:grid-cols-5": "lg:grid-cols-4 xl:grid-cols-4"}  gap-6`}>
                        {user.id === 1 ? (
                            <>
                                <MetricCard 
                                    title="Total Subscriptions" 
                                    value={totalSubscriptions} 
                                    icon={<FaUsers />}
                                    color="indigo"
                                />
                                <MetricCard 
                                    title="Total Revenue" 
                                    value={`$${totalRevenue.toFixed(2)}`} 
                                    icon={<FaDollarSign />}
                                    color="green"
                                />
                                <MetricCard 
                                    title="Text Messages" 
                                    value={totalTextMessages} 
                                    icon={<FaCommentAlt />}
                                    color="blue"
                                />
                                <MetricCard 
                                    title="Image Generations" 
                                    value={totalImageMessages} 
                                    icon={<FaImage />}
                                    color="amber"
                                />
                                <MetricCard 
                                    title="Audio Processing" 
                                    value={totalAudioMessages} 
                                    icon={<FaHeadphones />}
                                    color="rose"
                                />
                            </>
                        ) : (
                            <>
                                <WelcomeCard name={user.name} />
                                <MetricCard 
                                    title="Text Limit" 
                                    value={totalTextChatlimit} 
                                    icon={<FaCommentAlt />}
                                    color="blue"
                                />
                                <MetricCard 
                                    title="Image Limit" 
                                    value={totalImageChatlimit} 
                                    icon={<FaImage />}
                                    color="amber"
                                />
                                <MetricCard 
                                    title="Audio Limit" 
                                    value={totalAudioChatlimit} 
                                    icon={<FaHeadphones />}
                                    color="rose"
                                />
                            </>
                        )}
                    </div>

                    {/* Tables */}
                    {user.id == 1 && <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <Section 
                            title={user.id === 1 ? "All Subscriptions" : "Your Subscriptions"}
                            icon={<FaCreditCard className="text-indigo-600" />}
                        >
                            {subscriptions?.length > 0 ? (
                                <SubscriptionTable 
                                    pageConfig={pageConfig} 
                                    setPageConfig={setPageConfig} 
                                    headers={["ID", "Plan", "Price", "Starts At", "Ends At", "Status"]} 
                                />
                            ) : (
                                <EmptyState 
                                    message="No subscriptions found." 
                                    icon={<FaCreditCard className="w-12 h-12 text-gray-300" />}
                                />
                            )}
                        </Section>

                        <Section 
                            title={user.id === 1 ? "All Invoices" : "Your Invoices"}
                            icon={<FaFileInvoice className="text-indigo-600" />}
                        >
                            {invoices.length > 0 ? (
                                <InvoiceTable 
                                    pageConfig={pageConfig} 
                                    setPageConfig={setPageConfig} 
                                    headers={["Invoice ID", "Amount", "Date", "Action"]} 
                                />
                            ) : (
                                <EmptyState 
                                    message="No invoices found." 
                                    icon={<FaFileInvoice className="w-12 h-12 text-gray-300" />}
                                />
                            )}
                        </Section>
                    </div>}


                    {/* Here show all card with link */}
                    {user.id != 1 && <ServiceCards/>}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

/* MetricCard Component */
const MetricCard = ({ title, value, icon, color }) => {
    const colorMap = {
        indigo: {
            bg: 'bg-indigo-50',
            text: 'text-indigo-700',
            iconBg: 'bg-indigo-100',
            iconText: 'text-indigo-600',
            border: 'border-indigo-100'
        },
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-700',
            iconBg: 'bg-blue-100',
            iconText: 'text-blue-600',
            border: 'border-blue-100'
        },
        green: {
            bg: 'bg-green-50',
            text: 'text-green-700',
            iconBg: 'bg-green-100',
            iconText: 'text-green-600',
            border: 'border-green-100'
        },
        amber: {
            bg: 'bg-amber-50',
            text: 'text-amber-700',
            iconBg: 'bg-amber-100',
            iconText: 'text-amber-600',
            border: 'border-amber-100'
        },
        rose: {
            bg: 'bg-rose-50',
            text: 'text-rose-700',
            iconBg: 'bg-rose-100',
            iconText: 'text-rose-600',
            border: 'border-rose-100'
        }
    };

    const colors = colorMap[color] || colorMap.indigo;

    return (
        <div className={`${colors.bg} border ${colors.border} rounded-xl shadow-sm p-6 transition-all hover:shadow-md`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <p className={`text-2xl font-bold ${colors.text} mt-2`}>{value}</p>
                </div>
                <div className={`${colors.iconBg} p-3 rounded-lg ${colors.iconText}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

/* WelcomeCard Component */
const WelcomeCard = ({ name }) => (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl shadow-sm p-6 col-span-1 lg:col-span-1 xl:col-span-1">
        <div className="flex flex-col justify-between h-full">
            <div>
                <h3 className="text-sm font-medium text-gray-500">Welcome</h3>
                <p className="text-xl font-semibold text-indigo-700 mt-2">Hi, {name} 👋</p>
            </div>
            <p className="text-sm text-gray-600 mt-4">
                We're glad to have you back. Check your usage limits below.
            </p>
        </div>
    </div>
);

/* Section Wrapper */
const Section = ({ title, children, icon }) => (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden max-h-[400px]">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center">
            <div className="p-2 rounded-lg bg-indigo-50 mr-3">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="p-6 overflow-y-auto max-h-[300px]">
            {children}
        </div>
    </div>
);

/* Empty State Component */
const EmptyState = ({ message, icon }) => (
    <div className="text-center py-12">
        <div className="flex justify-center mb-4">
            {icon}
        </div>
        <p className="text-gray-500">{message}</p>
    </div>
);
