import React, { useState } from "react";
import axios from "axios";
import { router, usePage } from "@inertiajs/react";

export default function GenerateTitle({
    topic,
    relatedKeywords,
    mainKeyword,
    setTitle,
}) {
    const { props } = usePage();

    const [numberOfTitle, setNumberOfTitle] = useState(1);
    const [language, setLanguage] = useState("English");
    const [tone, setTone] = useState("Professional");
    const [titles, setTitles] = useState(null);
    const [loading, setLoading] = useState(false);

    // Function to call Open API
    const generateTitle = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/generate-title", {
                topic,
                relatedKeywords,
                mainKeyword,
                numberOfTitle: Number(numberOfTitle),
                language,
                tone,
            });

            setTitles(response.data.content); // Store the generated keywords
        } catch (error) {
            console.error(
                "Error generating keywords:",
                error.response?.data || error.message
            );
        }
        setLoading(false);
    };

  

    const handleChangeTitle = (value) => {
        setTitle(value);
        router.put("/upsert/blog", {
            blogId: props?.blogData?.id || null,
            title: value,
        });
    };
    return (
        <div className="p-2">
            {/* Form */}
            <form onSubmit={generateTitle} className="space-y-4">
                {/* Keyword Count Inputs */}
                <div className="grid grid-cols-1 mb-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">
                            Number of Title
                        </label>
                        <input
                            type="number"
                            value={numberOfTitle}
                            onChange={(e) => setNumberOfTitle(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            min="1"
                            required
                        />
                    </div>
                </div>

                {/* Language & Tone Select */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Language Select */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Language
                        </label>
                        <select
                            className="w-full border border-gray-300 p-2 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Tone
                        </label>
                        <select
                            className="w-full border border-gray-300 p-2 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                        >
                            <option value="Professional">Professional</option>
                            <option value="Friendly">Friendly</option>
                            <option value="Dramatic">Dramatic</option>
                        </select>
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate Keywords"}
                </button>
            </form>

            {/* Display Generated Keywords */}
            {titles && (
                <div className="mt-4 p-5 border border-gray-300 rounded-md bg-white">
                    <div>
                        {/* Main Keywords Section */}
                        <h3 className="font-semibold text-gray-700 mb-3">
                        Generated Titles
                        </h3>
                        <ul className="space-y-2">
                            {titles?.data?.title &&
                                Object?.entries(
                                    titles?.data?.title
                                ).map(([key, value]) => (
                                    <li
                                        key={key}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="radio"
                                            name="title"
                                            id={`radio-${key}`}
                                            value={value}
                                            onChange={() =>
                                                handleChangeTitle(value)
                                            }
                                            className="w-4 h-4 text-blue-600 focus:ring-0"
                                        />
                                        <label
                                            htmlFor={`radio-${key}`}
                                            className="text-gray-700 cursor-pointer"
                                        >
                                            {value}
                                        </label>
                                    </li>
                                ))}
                        </ul>

                       
                    </div>
                </div>
            )}
        </div>
    );
}
