import { usePage, router, Link } from "@inertiajs/react";
import React from "react";

export default function BlogList() {
    const { blogData } = usePage().props;

    // Function to delete a blog
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this blog post?")) {
            router.delete(`/blog-data/${id}`, {
                preserveState: true,
            });
        }
    };

    // Function to edit a blog
    const handleEdit = (id) => {
        router.get(`/blog-data/${id}`);
    };

    return (
        <div className="p-8 min-h-screen bg-gray-50 flex justify-center">
            <div className="w-full max-w-6xl bg-white rounded border border-gray-200 overflow-hidden">
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Blog List
                    </h1>
                    <Link
                        href="/blog-data"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Generate Blog
                    </Link>
                </div>

                {blogData.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">
                        No blogs available.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        SL
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Topic
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Keywords
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created Date
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {blogData.map((blog, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 transition duration-150 ease-in-out"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {blog.title || "Untitled"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {blog.topic || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">
                                            {blog.related_keywords
                                                ? blog.related_keywords.join(
                                                      ", "
                                                  )
                                                : "No keywords"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(
                                                blog.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center">
                                            <div className="flex justify-center gap-3">
                                                {/* Edit Button */}
                                                <button
                                                    onClick={() =>
                                                        handleEdit(blog.id)
                                                    }
                                                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-200"
                                                >
                                                    Edit
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() =>
                                                        handleDelete(blog.id)
                                                    }
                                                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition duration-200"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
