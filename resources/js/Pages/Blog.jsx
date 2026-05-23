import BlogList from "@/Components/Blog/BlogList";
import { Head } from "@inertiajs/react";
import React from "react";

export default function Blog() {
    return (
        <div>
            <Head title="Blog Generator" />
            <BlogList />
        </div>
    );
}
