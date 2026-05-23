
export default function AuthenticatedLayout({ children }) {
    return (
        <div className=" bg-gray-100">
            <main>{children}</main>
        </div>
    );
}
