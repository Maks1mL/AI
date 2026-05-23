import { usePage,router } from "@inertiajs/react";

export default function SubscriptionTable({ setPageConfig,pageConfig, headers }) {
    const { subscriptions, totalSubscriptions } = usePage().props;
    const user = usePage().props.auth.user;
    const useQueryParams = () => {
        const page = usePage();
        return new URLSearchParams(page.url.split('?')[1]);
    };
    const queryParams = useQueryParams();
    const pageNumber = queryParams.get('subPage') || 1;
    // ✅ Change page dynamically without reload
    const changePage = (direction) => {
        setPageConfig((prevPageConfig) => {
            let newPage = prevPageConfig.subPage + direction;
            if (newPage <= 0) newPage = 1;
            router.get(
                `/dashboard`,
                { month: pageConfig.month, subPage: newPage, invPage: pageConfig.invPage },
                { preserveScroll: true }
            );
            return { ...prevPageConfig, subPage: newPage }; // Update state correctly
        });
    };
    return (
        <>
        
            <div className="overflow-x-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            {headers.map((header) => (
                                <th
                                    key={header}
                                    className="px-[11px] py-3 text-left text-xs font-medium text-gray-500 uppercase"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {subscriptions.map((row) => (
                            <tr key={row.id}>
                                <td className="px-[11px] py-4 whitespace-nowrap text-sm text-gray-700">
                                    {row.id}
                                </td>
                                <td className="px-[11px] py-4 whitespace-nowrap text-sm text-gray-700">
                                    {row.plan?.name || row.amount}
                                </td>
                                <td className="px-[11px] py-4 whitespace-nowrap text-sm text-gray-700">
                                    {row.plan?.price || row.price}
                                </td>
                                <td className="px-[11px] py-4 whitespace-nowrap text-sm text-gray-700">
                                    {new Date(
                                        row.starts_at || row.paid_at
                                    ).toLocaleDateString()}
                                </td>
                                <td className="px-[11px] py-4 whitespace-nowrap text-sm text-gray-700">
                                    {new Date(
                                        row.ends_at || row.paid_at
                                    ).toLocaleDateString()}
                                </td>
                                <td className="px-[11px] py-4 whitespace-nowrap text-sm text-gray-700">
                                    {row.ends_at < new Date().toISOString()
                                        ? "Expired"
                                        : "Active"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {user.id === 1 && (
                <PaginationButtonsSubscription
                    page={pageConfig.subPage}
                    changePage={changePage}
                    total={totalSubscriptions}
                    pageNumber={pageNumber}
                />
            )}
        </>
    );
}

const PaginationButtonsSubscription = ({
    page,
    changePage,
    total,
    pageNumber
}) => (

    <div className="flex justify-between items-center mt-4">
        {total > 10 && (
            <>
                <button
                    onClick={() => changePage(-1)}
                    disabled={page === 0}
                    className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-gray-700">Page {pageNumber}</span>
                
                <button
                    onClick={() => changePage(1)}
                    disabled = {total <= (pageNumber * 10)}
                    className="px-4 py-2 bg-gray-300 rounded-md"
                >
                    Next
                </button>
                
            </>
        )}
    </div>
);
