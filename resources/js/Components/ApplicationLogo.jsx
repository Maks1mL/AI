import { usePage } from "@inertiajs/react";

export default function ApplicationLogo() {
    const { appSetting } = usePage().props;
    const rootUrl = window.location.origin;

    return (
        <>
            {appSetting?.logo && (
                <div className="h-24 w-24 ">
                    <img
                        className="rounded-full overflow-hidden border border-gray-200"
                        src={`${rootUrl}/storage/${appSetting?.logo}`}
                        alt=""
                    />
                </div>
            )}
        </>
    );
}
