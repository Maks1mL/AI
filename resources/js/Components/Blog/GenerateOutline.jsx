import React, { useState } from "react";
import axios from "axios";
import { router, usePage } from "@inertiajs/react";

export default function GenerateOutline({ setBlogOutline }) {
    const { props } = usePage();

    const [numberOfOutline, setNumberOfOutline] = useState(1);
    const [language, setLanguage] = useState("English");
    const [tone, setTone] = useState("Professional");
    const [outline, setOutline] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null); 

    // Function to call Open API
    const generateOutline = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/generate-outline", {
                topic: props?.blogData?.topic,
                relatedKeywords: props?.blogData?.related_keywords,
                mainKeyword: props?.blogData?.main_keyword,
                title: props?.blogData?.title,
                metaDescription: props?.blogData?.meta_description,
                numberOfOutline: Number(numberOfOutline),
                language,
                tone,
            });

            setOutline(response.data.content);
        } catch (error) {
            console.error(
                "Error generating keywords:",
                error.response?.data || error.message
            );
        }
        setLoading(false);
    };

    const handleCardClick = (key, sections) => {
        const selectedSection =  Object.values(sections)
        setSelectedCard(key);
        setBlogOutline(selectedSection);
        router.put("/upsert/blog", {
            blogId: props?.blogData?.id || null,
            outline:selectedSection,
        });
    };

    return (
        <div className="p-2 ">
            {/* Form */}
            <form onSubmit={generateOutline} className="space-y-4">
                {/* Keyword Count Inputs */}
                <div className="grid grid-cols-1 mb-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">
                            Number Of Outline
                        </label>
                        <input
                            type="number"
                            value={numberOfOutline}
                            onChange={(e) => setNumberOfOutline(e.target.value)}
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
                    {loading ? "Generating..." : "Generate Outline"}
                </button>
            </form>

            {/* Display Generated Outline */}
            {outline && (
                <div className="">
                    <h3 className="font-semibold text-gray-700 my-3">
                        Generated Outline
                    </h3>

                    <div className="">
                        {outline?.data?.outline &&
                            Object.entries(outline?.data?.outline).map(
                                ([key, sections], index) => (
                                    <div
                                        key={index}
                                        className={`border p-4 rounded-lg bg-gray-50 mb-2 cursor-pointer transition ${
                                            selectedCard === key ? " bg-blue-50 border-blue-500 border-dashed" : ""
                                        }`}
                                        onClick={() => handleCardClick(key, sections)}
                                    >
                                        {/* Sections List */}
                                        <ul className="text-sm list-disc list-inside text-gray-700 ">
                                            {Object.entries(sections).map(
                                                ([
                                                    sectionKey,
                                                    sectionValue,
                                                ]) => (
                                                    <li key={sectionKey}>
                                                        {sectionValue}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )
                            )}
                    </div>
                </div>
            )}

          
        </div>
    );
}
