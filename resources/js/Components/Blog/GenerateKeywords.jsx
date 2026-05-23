import React, { useState } from "react";
import axios from "axios";
import { router, usePage } from "@inertiajs/react";

export default function GenerateKeywords({ topic,setMainKeyword,relatedKeywords ,setRelatedKeywords}) {

    const { props } = usePage();
    console.log("Props:", props);

    const [numberOfMainKeyword, setNumberOfMainKeyword] = useState(3);
    const [numberOfRelatedKeyWord, setNumberOfRelatedKeyWord] = useState(5);
    const [language, setLanguage] = useState("English");
    const [tone, setTone] = useState("Professional");
    const [keywords, setKeywords] = useState(null);
    const [loading, setLoading] = useState(false);
    // Function to call Laravel API
    const generateKeywords = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/generate-keyword", {
                topic,
                numberOfMainKeyword: Number(numberOfMainKeyword),
                numberOfRelatedKeyWord: Number(numberOfRelatedKeyWord),
                language,
                tone,
            });

            setKeywords(response.data.content); // Store the generated keywords
        } catch (error) {
            console.error(
                "Error generating keywords:",
                error.response?.data || error.message
            );
        }
        setLoading(false);
    };



    // Handle checkbox change
    const handleCheckboxChange = (value) => {
        let updatedRelatedKeyword ;
        if (relatedKeywords.includes(value)) {
            setRelatedKeywords(relatedKeywords.filter((item) => item !== value));
            updatedRelatedKeyword = relatedKeywords.filter((item) => item !== value);
        } else {
            setRelatedKeywords([...relatedKeywords, value]);
            updatedRelatedKeyword = [...relatedKeywords, value];
        }


        router.put('/upsert/blog', {
            blogId: props?.blogData?.id || null,
            relatedKeywords: updatedRelatedKeyword,
        },  {
            preserveState: true,  // Prevents page reload
            only: ['blogData'],   // Ensures only `blogData` is updated
            replace: true,        // Replaces the current URL in the history stack
            onSuccess: () => {
                console.log("Updated successfully!");
            },
            onError: (errors) => console.error("Update failed!", errors),
        });
    };

    const handleChangeMainKeyword = (value) => {
        setMainKeyword(value);
        router.put('/upsert/blog', { 
            blogId: props?.blogData?.id || null, 
            mainKeyword: value, 
            topic: topic, 
        }  , {
            preserveState: true,  // Prevents page reload
            only: ['blogData'],   // Ensures only `blogData` is updated
            replace: true,        // Replaces the current URL in the history stack
            onSuccess: () => {
                console.log("Updated successfully!");
            },
            onError: (errors) => console.error("Update failed!", errors),
        });
    
    }
    return (
        <div className="p-2">
            {/* Form */}
            <form onSubmit={generateKeywords} className="space-y-4">
                {/* Keyword Count Inputs */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">
                            Main Keywords:
                        </label>
                        <input
                            type="number"
                            value={numberOfMainKeyword}
                            onChange={(e) =>
                                setNumberOfMainKeyword(e.target.value)
                            }
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            min="1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">
                            Related Keywords:
                        </label>
                        <input
                            type="number"
                            value={numberOfRelatedKeyWord}
                            onChange={(e) =>
                                setNumberOfRelatedKeyWord(e.target.value)
                            }
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
            {keywords && (
    <div className="mt-4 p-5 border border-gray-300 rounded-md bg-white">
        <div>
            {/* Main Keywords Section */}
            <h3 className="font-semibold text-gray-700 mb-3">Main Keywords</h3>
            <ul className="space-y-2">
                {keywords?.data?.mainKeyword && Object?.entries(keywords?.data?.mainKeyword).map(([key, value]) => (
                    <li key={key} className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="mainKeyword"
                            id={`radio-${key}`}
                            value={value}
                            onChange={() => handleChangeMainKeyword(value)}
                            className="w-4 h-4 text-blue-600 focus:ring-0"
                        />
                        <label htmlFor={`radio-${key}`} className="text-gray-700 cursor-pointer">
                            {value}
                        </label>
                    </li>
                ))}
            </ul>

            {/* Related Keywords Section */}
            <div className="mt-5">
                <h3 className="font-semibold text-gray-700 mb-3">Related Keywords</h3>
                <ul className="space-y-2">
                    {keywords?.data?.relatedKeyword && Object?.entries(keywords?.data?.relatedKeyword).map(([key, value]) => (
                        <li key={key} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`checkbox-${key}`}
                                value={value}
                                checked={relatedKeywords.includes(value)}
                                onChange={() => handleCheckboxChange(value)}
                                className="w-4 h-4 text-blue-600 focus:ring-0"
                            />
                            <label htmlFor={`checkbox-${key}`} className="text-gray-700 cursor-pointer">
                                {value}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
)}

        </div>
    );
}
