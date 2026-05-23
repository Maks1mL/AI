import React, { useState } from "react";
import QuillEditor from "@/Components/Editor/QuillEditor";
import Sidebar from "@/Components/Blog/Sidebar";
import GenerateKeywords from "@/Components/Blog/GenerateKeywords";
import GenerateTitle from "@/Components/Blog/GenerateTitle";
import GenerateMetaDescription from "@/Components/Blog/GenerateMetaDescription";
import GenerateOutline from "@/Components/Blog/GenerateOutline";
import { Head, Link, router, usePage } from "@inertiajs/react";

const BlogPostGenerator = () => {
    const { props } = usePage();
    console.log("Props:", props);
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState("");
    const [type, setType] = useState("");
    const [topic, setTopic] = useState(props?.blogData?.topic || "");
    const [title, setTitle] = useState(props?.blogData?.title || "");
    const [mainKeyword, setMainKeyword] = useState(
        props?.blogData?.main_keyword || ""
    );
    const [relatedKeywords, setRelatedKeywords] = useState(
        props?.blogData?.related_keywords || []
    );
    const [metaDescription, setMetaDescription] = useState(
        props?.blogData?.meta_description || ""
    );
    const [outline, setBlogOutline] = useState(props?.blogData?.outline || "");

    const [language, setLanguage] = useState("English");
    const [contentType, setContentType] = useState("Article");
    const [category, setCategory] = useState("Technology");
    const [loading, setLoading] = useState(false);
    const [blogContent, setBlogContent] = useState(props?.blogData?.blog_post ||"");
    const [postSaveLoading, setPostSaveLoading] = useState(false);
    // Component mapping for dynamic rendering
    const componentMap = {
        keywords: GenerateKeywords,
        title: GenerateTitle,
        meta_description: GenerateMetaDescription,
        outline: GenerateOutline,
    };

    // Function to open the sidebar and set type
    const handleOpenDrawer = (type) => {
        setType(type);
        setIsOpen(true);
    };

    const SelectedComponent = componentMap[type];

    const handleRelatedKeywordsChange = (e) => {
        const inputValue = e.target.value;

        const keywordsArray = inputValue
            .split(",")
            .map((keyword) => keyword.trim());

        setRelatedKeywords(keywordsArray);
    };

    const handleGenerateBlogPost = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/generate-blog", {
                topic: props?.blogData?.topic,
                relatedKeywords: props?.blogData?.related_keywords,
                mainKeyword: props?.blogData?.main_keyword,
                title: props?.blogData?.title,
                metaDescription: props?.blogData?.meta_description,
                outline: props?.blogData?.outline,
                numberOfBlogWord: language,
                tone: contentType,
            });

            setBlogContent(response?.data?.content?.data?.blog_post);
        } catch (error) {
            console.error(
                "Error generating keywords:",
                error.response?.data || error.message
            );
        }
        setLoading(false);
    };

    const handleSaveContent = () => {
        setPostSaveLoading(true);
        router.put(
            "/upsert/blog",
            {
                blogId: props?.blogData?.id || null,
                blogPost: blogContent,
            },
            {
                preserveState: true, // Prevents page reload
                only: ["blogData"], // Ensures only `blogData` is updated
                replace: true, // Replaces the current URL in the history stack
                onSuccess: () => {
                    console.log("Updated successfully!");
                },
                
                onError: (errors) => console.error("Update failed!", errors),
            }
        );
        setPostSaveLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 py-8">
            <Head title="Blog Generator"/>
            <div className="overflow-hidden max-w-[1400px] w-full mx-auto bg-white rounded-lg shadow h-[85vh] flex">
                <div className="bg-white rounded-lg overflow-hidden border border-gray-100 h-full w-full">
                    <table className="w-full border-separate border-spacing-0 h-full">
                        <thead>
                            <tr>
                                <th className="border-b border-gray-100 p-3 text-base font-semibold text-gray-700 w-[35%]">
                                    <div className="flex justify-between items-center">
                                        <span>Title</span>
                                        <Link className="bg-white hover:bg-gray-50 transition-all border border-gray-200 px-3 py-1.5 text-sm rounded shadow-sm" href="/blog">Back</Link>
                                    </div>
                                </th>
                                <th className="border-b border-gray-100 p-3 text-base font-semibold text-gray-700">Content</th>
                            </tr>
                        </thead>
                        <tbody className="h-full">
                            <tr className="h-full">
                                <td className="align-top bg-white border-r border-gray-100 p-4 h-full">
                                    <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                                    <form className="space-y-4">
                                        {/* Topic Input */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-200 p-2 rounded text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400"
                                                placeholder="Enter a topic..."
                                                value={topic}
                                                onChange={(e) => setTopic(e.target.value)}
                                            />
                                        </div>
                                        {/* Main Keyword Input */}
                                        <div>
                                            <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                                                Main Keyword (Max 6 Words)
                                                <span
                                                    onClick={() => handleOpenDrawer("keywords")}
                                                    className="text-blue-600 flex gap-1 text-xs bg-white rounded-full px-2 py-0.5 hover:cursor-pointer hover:bg-gray-50 transition-all items-center border border-blue-200"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-rotate-cw"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                                                    Generate
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-200 p-2 rounded text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400"
                                                placeholder="Enter a keyword..."
                                                value={mainKeyword}
                                                onChange={(e) => setMainKeyword(e.target.value)}
                                            />
                                        </div>
                                        {/* Related Keywords Input */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Related Keywords</label>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-200 p-2 rounded text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400"
                                                placeholder="Enter related keywords..."
                                                value={relatedKeywords.join(", ")}
                                                onChange={handleRelatedKeywordsChange}
                                            />
                                        </div>
                                        {/* Title Input */}
                                        <div>
                                            <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                                                Title
                                                <span
                                                    onClick={() => handleOpenDrawer("title")}
                                                    className="flex gap-1 text-xs bg-white rounded-full px-2 py-0.5 hover:cursor-pointer hover:bg-gray-50 transition-all text-blue-600 items-center border border-blue-200"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-rotate-cw"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                                                    Generate
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-200 p-2 rounded text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400"
                                                placeholder="Enter title..."
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </div>
                                        {/* Meta Description */}
                                        <div>
                                            <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                                                Meta Description
                                                <span
                                                    onClick={() => handleOpenDrawer("meta_description")}
                                                    className="flex gap-1 text-xs bg-white rounded-full px-2 py-0.5 hover:cursor-pointer hover:bg-gray-50 transition-all text-blue-600 items-center border border-blue-200"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-rotate-cw"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                                                    Generate
                                                </span>
                                            </label>
                                            <textarea
                                                rows={2}
                                                className="w-full border border-gray-200 p-2 rounded text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition resize-none placeholder-gray-400"
                                                placeholder="Enter meta description..."
                                                value={metaDescription}
                                                onChange={(e) => setMetaDescription(e.target.value)}
                                            />
                                        </div>
                                        {/* Outline */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-sm font-medium text-gray-700">Outline</h3>
                                                <span
                                                    onClick={() => handleOpenDrawer("outline")}
                                                    className="flex gap-1 text-xs bg-white rounded-full px-2 py-0.5 hover:cursor-pointer hover:bg-gray-50 transition-all text-blue-600 items-center border border-blue-200"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-rotate-cw"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                                                    Generate
                                                </span>
                                            </div>
                                            <div>
                                                {outline ? (
                                                    <div className="space-y-1.5">
                                                        {outline?.map((item, index) => (
                                                            <div className="flex gap-1 items-center" key={index}>
                                                                <span className="font-medium text-gray-400 text-xs">#</span>
                                                                <input
                                                                    type="text"
                                                                    className="text-xs text-gray-500 w-full border border-gray-100 p-1.5 rounded bg-white"
                                                                    value={item}
                                                                    readOnly
                                                                />
                                                                <div className="flex gap-1">
                                                                    <button className="border border-green-300 rounded p-0.5 hover:bg-green-50 transition" tabIndex={-1} type="button">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                                                    </button>
                                                                    <button className="border border-red-300 rounded p-0.5 hover:bg-red-50 transition" tabIndex={-1} type="button">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="rounded bg-gray-50 p-2 text-xs text-gray-500">No Outline</div>
                                                )}
                                            </div>
                                        </div>
                                        {/* Core Settings */}
                                        <h3 className="border-t text-sm font-medium pt-3 mt-3 text-gray-700">Core Settings</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Language Select */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                                <select
                                                    className="w-full border border-gray-200 p-1.5 rounded text-sm bg-white focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
                                                    value={language}
                                                    onChange={(e) => setLanguage(e.target.value)}
                                                >
                                                    <option value="English">English</option>
                                                    <option value="Arabic">Arabic</option>
                                                    <option value="Bangla">Bangla</option>
                                                </select>
                                            </div>
                                            {/* Content Type Select */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                                                <select
                                                    className="w-full border text-sm border-gray-200 p-1.5 rounded bg-white focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
                                                    value={contentType}
                                                    onChange={(e) => setContentType(e.target.value)}
                                                >
                                                    <option value="Professional">Professional</option>
                                                    <option value="Friendly">Friendly</option>
                                                    <option value="Dramatic">Dramatic</option>
                                                </select>
                                            </div>
                                        </div>
                                        {/* Category Select */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Article Length</label>
                                            <select
                                                className="w-full border border-gray-200 p-1.5 rounded text-sm bg-white focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                            >
                                                <option value="1000-2500">Small (1000-2500 words)</option>
                                                <option value="2500-3500">Medium (2500-3500 words)</option>
                                                <option value="3500-5500">Large (3500-5500 words)</option>
                                            </select>
                                        </div>
                                    </form>
                                    </div>
                                </td>
                                <td className="align-top p-4 bg-white h-full">
                                    <div className="rounded border border-gray-100 p-1 h-full">
                                        <QuillEditor text={blogContent} setText={setText} />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot className="border-0">
                            <tr>
                                <th className="p-3 text-left border-b-0 border-t border-gray-100">
                                    <button
                                        disabled={loading}
                                        type="button"
                                        onClick={handleGenerateBlogPost}
                                        className={`px-4 py-1.5 rounded font-medium text-white shadow transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                                                Generating...
                                            </span>
                                        ) : (
                                            "Generate Blog Post"
                                        )}
                                    </button>
                                </th>
                                <th className="p-3 text-left border-t border-gray-100 border-b-0">
                                    <button
                                        disabled={loading}
                                        type="button"
                                        onClick={handleSaveContent}
                                        className={`px-4 py-1.5 rounded font-medium text-white shadow transition ${postSaveLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                                    >
                                        {postSaveLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                                                Saving...
                                            </span>
                                        ) : (
                                            "Save Blog Post"
                                        )}
                                    </button>
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                {/* Sidebar with dynamic content based on `type` */}
                <Sidebar
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    title={type ? ` ${type.replace("_", " ")}` : "Keywords"}
                >
                    <div className="p-2">
                        {SelectedComponent && (
                            <SelectedComponent
                                mainKeyword={mainKeyword}
                                relatedKeywords={relatedKeywords}
                                setRelatedKeywords={setRelatedKeywords}
                                topic={topic}
                                setMainKeyword={setMainKeyword}
                                setTitle={setTitle}
                                setMetaDescription={setMetaDescription}
                                setBlogOutline={setBlogOutline}
                            />
                        )}
                    </div>
                </Sidebar>
            </div>
        </div>
    );
};

export default BlogPostGenerator;
