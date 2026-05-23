<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\BlogData;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class BlogGeneratorController extends Controller
{
    public function fetchBlogData()
    {
        return Inertia::render('BlogPostGenerator');
    }
    /**
     * Handle OpenAI API request.
     */
    private function callOpenAI($prompt, $responseFormat = 'json')
    {
        $providerRecord = Provider::where('name', 'openai')->first();

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $providerRecord->api_key,
            'Content-Type' => 'application/json',

        ])->post(
            'https://api.openai.com/v1/chat/completions',
            [
                'model' => 'gpt-4o-mini',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are an AI assistant specialized in SEO-optimized blog writing.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'response_format' => $responseFormat,
            ]
        );
        return $response->json()['choices'][0]['message']['content'] ?? 'Error generating content.';
    }

    /**
     * Generate main keyword.
     */
    public function generateKeyword(Request $request)
    {
        $request->validate(['topic' => 'required|string|max:255']);
        $numberOfMainKeyword = $request->numberOfMainKeyword;
        $numberOfRelatedKeyWord = $request->numberOfRelatedKeyWord;
        $language = $request->language;
        $tone = $request->tone;


        $mainKeywordArray = [];
        for ($i = 1; $i <= $numberOfMainKeyword; $i++) {
            $mainKeywordArray["key{$i}"] = ['type' => 'string'];
        }

        $relatedKeywordArray = [];
        for ($i = 1; $i <= $numberOfRelatedKeyWord; $i++) {
            $relatedKeywordArray["key{$i}"] = ['type' => 'string'];
        }

        $mainKeywordArrayKeys = array_keys($mainKeywordArray);
        $relatedKeywordArrayKeys = array_keys($relatedKeywordArray);

        $responseFormate = [
            'type'        => 'json_schema',
            'json_schema' => [
                'name'   => 'seo_keywords',
                'schema' => [
                    'type'                 => 'object',
                    'properties'           => [
                        'data' => [
                            'type'       => 'object',
                            'properties' => [
                                'mainKeyword'   => [
                                    'type'       => 'object',
                                    'properties' => $mainKeywordArray,
                                    'required'             => $mainKeywordArrayKeys,
                                    'additionalProperties' => false,
                                ],
                                'relatedKeyword' => [
                                    'type'       => 'object',
                                    'properties' => $relatedKeywordArray,
                                    'required'             => $relatedKeywordArrayKeys,
                                    'additionalProperties' => false,
                                ],
                            ],
                            'required'             => ['mainKeyword', 'relatedKeyword'],
                            'additionalProperties' => false,
                        ],
                    ],
                    'required'             => ['data'],
                    'additionalProperties' => false,
                ],
                'strict' => true,
            ],
        ];

        $prompt = "For the topic {$request->topic}, generate {$numberOfMainKeyword} main keywords and {$numberOfRelatedKeyWord}related keywords. The output should be in {$language}, written in a {$tone} style, and returned as a JSON object with this 2 keys mainKeyword and relatedKeyword.Do not include any extra text.";


        $generatedKeyword = $this->callOpenAI($prompt, $responseFormate);

        $data = json_decode($generatedKeyword, true);


        return response()->json(["content" => $data], 200, [
            'Content-Type' => 'application/json',
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    /**
     * Generate blog title.
     */
    public function generateTitle(Request $request)
    {
        $numberOfTitle = $request->numberOfTitle;
        $language = $request->language;
        $tone = $request->tone;
        $relatedKeywords = $request->relatedKeywords;
        $mainKeyword = $request->mainKeyword;
        $topic = $request->topic;


        $titleArray = [];
        for ($i = 1; $i <= $numberOfTitle; $i++) {
            $titleArray["key{$i}"] = ['type' => 'string'];
        }

        $titleArrayKeys = array_keys($titleArray);

        $newRelatedKeywords = '';
        foreach ($relatedKeywords as $key => $value) {
            $newRelatedKeywords .= $value . ',';
        }


        $responseFormate = [
            'type'        => 'json_schema',
            'json_schema' => [
                'name'   => 'seo_keywords',
                'schema' => [
                    'type'                 => 'object',
                    'properties'           => [
                        'data' => [
                            'type'       => 'object',
                            'properties' => [
                                'title'   => [
                                    'type'       => 'object',
                                    'properties' => $titleArray,
                                    'required'             => $titleArrayKeys,
                                    'additionalProperties' => false,
                                ],
                            ],
                            'required'             => ['title'],
                            'additionalProperties' => false,
                        ],
                    ],
                    'required'             => ['data'],
                    'additionalProperties' => false,
                ],
                'strict' => true,
            ],
        ];

        $prompt = "For the topic {$topic}, generate {$numberOfTitle} SEO-friendly blog titles using the main keyword {$mainKeyword} and the related keyword {$newRelatedKeywords}. The output should be in {$language} with a {$tone} tone, Do not include any extra text.";

        $generatedTitle = $this->callOpenAI($prompt, $responseFormate);

        $data = json_decode($generatedTitle, true);

        return response()->json(["content" => $data], 200, [
            'Content-Type' => 'application/json',
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

    /**
     * Generate meta description.
     */
    public function generateMetaDescription(Request $request)
    {
        $numberOfDescription = $request->numberOfDescription;
        $language = $request->language;
        $tone = $request->tone;
        $relatedKeywords = $request->relatedKeywords;
        $mainKeyword = $request->mainKeyword;
        $topic = $request->topic;
        $title = $request->title;

        $newRelatedKeywords = '';
        foreach ($relatedKeywords as $key => $value) {
            $newRelatedKeywords .= $value . ',';
        }

        $descriptionArray = [];
        for ($i = 1; $i <= $numberOfDescription; $i++) {
            $descriptionArray["key{$i}"] = ['type' => 'string'];
        }
        $descriptionArrayKeys = array_keys($descriptionArray);


        $responseFormate = [
            'type'        => 'json_schema',
            'json_schema' => [
                'name'   => 'seo_keywords',
                'schema' => [
                    'type'                 => 'object',
                    'properties'           => [
                        'data' => [
                            'type'       => 'object',
                            'properties' => [
                                'metaDescription'   => [
                                    'type'       => 'object',
                                    'properties' => $descriptionArray,
                                    'required'             => $descriptionArrayKeys,
                                    'additionalProperties' => false,
                                ],
                            ],
                            'required'             => ['metaDescription'],
                            'additionalProperties' => false,
                        ],
                    ],
                    'required'             => ['data'],
                    'additionalProperties' => false,
                ],
                'strict' => true,
            ],
        ];
        $prompt = "For the topic '{$topic}', generate '{$numberOfDescription}' SEO-friendly meta description using the title {$title} using the main keyword '{$mainKeyword}' and the related keyword '{$newRelatedKeywords}'. The output should be in '{$language}', written in a '{$tone}' style, Do not include any extra text.";

        $generatedMeta = $this->callOpenAI($prompt, $responseFormate);

        $data = json_decode($generatedMeta, true);

        return response()->json(["content" => $data], 200, [
            'Content-Type' => 'application/json',
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }



    public function generateOutline(Request $request)
    {
        $numberOfOutline = $request->numberOfOutline;
        $language = $request->language;
        $tone = $request->tone;
        $relatedKeywords = $request->relatedKeywords;
        $mainKeyword = $request->mainKeyword;
        $topic = $request->topic;
        $title = $request->title;
        $metaDescription = $request->metaDescription;

        $newRelatedKeywords = '';
        foreach ($relatedKeywords as $key => $value) {
            $newRelatedKeywords .= $value . ',';
        }

        // Build initial JSON schema for outline count
        $outlineArray = [];
        for ($i = 1; $i <= $numberOfOutline; $i++) {
            $outlineArray["key{$i}"] = ['type' => 'string'];
        }
        $outlineArrayKeys = array_keys($outlineArray);

        $responseFormate = [
            'type'        => 'json_schema',
            'json_schema' => [
                'name'   => 'seo_keywords',
                'schema' => [
                    'type'       => 'object',
                    'properties' => [
                        'data' => [
                            'type'       => 'object',
                            'properties' => [
                                'outline' => [
                                    'type'                 => 'object',
                                    'properties'           => $outlineArray,
                                    'required'             => $outlineArrayKeys,
                                    'additionalProperties' => false,
                                ],
                            ],
                            'required'             => ['outline'],
                            'additionalProperties' => false,
                        ],
                    ],
                    'required'             => ['data'],
                    'additionalProperties' => false,
                ],
                'strict' => true,
            ],
        ];

        // Prompt for outline count
        $prompt1 = "For the topic '{$topic}', generate {$numberOfOutline} detailed blog outline counts. Using the title '{$title}', main keyword '{$mainKeyword}' and the related keyword '{$newRelatedKeywords}', return how many sections you want to include for each outline key. The output should be in '{$language}', written in a '{$tone}' style. Return only the number for each outline key.";

        // Call OpenAI to get outline count numbers
        $generatedOutline = $this->callOpenAI($prompt1, $responseFormate);

        if (empty($generatedOutline)) {
            return response()->json(['error' => 'Failed to generate outline count'], 500);
        }

        $data = json_decode($generatedOutline, true);

        // Retrieve outline count data
        $outlineCountData = $data['data']['outline'];

        // Build new JSON schema based on the returned section counts
        $newOutlineArray = [];
        foreach ($outlineCountData as $outlineKey => $countStr) {
            $numSections = intval($countStr);
            $sectionProperties = [];
            for ($i = 1; $i <= $numSections; $i++) {
                $sectionProperties["sec{$i}"] = ['type' => 'string'];
            }
            $sectionKeys = array_keys($sectionProperties);
            $newOutlineArray[$outlineKey] = [
                'type'                 => 'object',
                'properties'           => $sectionProperties,
                'required'             => $sectionKeys,
                'additionalProperties' => false,
            ];
        }

        $newResponseFormate = [
            'type'        => 'json_schema',
            'json_schema' => [
                'name'   => 'blog_outline_details',
                'schema' => [
                    'type'       => 'object',
                    'properties' => [
                        'data' => [
                            'type'       => 'object',
                            'properties' => [
                                'outline' => [
                                    'type'       => 'object',
                                    'properties' => $newOutlineArray,
                                    'required'   => array_keys($newOutlineArray),
                                    'additionalProperties' => false,
                                ],
                            ],
                            'required'             => ['outline'],
                            'additionalProperties' => false,
                        ],
                    ],
                    'required'             => ['data'],
                    'additionalProperties' => false,
                ],
                'strict' => true,
            ],
        ];

        $prompt2 = "For the topic '{$topic}', generate {$numberOfOutline}  blog outline sections. Using the title '{$title}', main keyword '{$mainKeyword}' and the related keyword '{$newRelatedKeywords}' and meta description {$metaDescription}, generate the outline. The output should be in '{$language}', written in a '{$tone}' style, It may max contain 3 or 4 word. Do not include any extra text.";

        $generatedOutline = $this->callOpenAI($prompt2, $newResponseFormate);
        if (empty($generatedOutline)) {
            return response()->json(['error' => 'Failed to generate detailed outline'], 500);
        }

        $data = json_decode($generatedOutline, true);

        // Return the final detailed outline response
        return response()->json(["content" => $data], 200, [
            'Content-Type' => 'application/json',
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }



    /**
     * Generate final blog post.
     */
    public function generateBlogPost(Request $request)
    {
        $numberOfBlogWord = $request->numberOfBlogWord;
        $language = $request->language;
        $tone = $request->tone;
        $relatedKeywords = $request->relatedKeywords;
        $mainKeyword = $request->mainKeyword;
        $topic = $request->topic;
        $title = $request->title;
        $metaDescription = $request->metaDescription;
        $outline = $request->outline;

        $newRelatedKeywords = '';
        foreach ($relatedKeywords as $key => $value) {
            $newRelatedKeywords .= $value . ',';
        }

        $newOutline = '';
        foreach ($outline as $key => $value) {
            $newOutline .= $value . ',';
        }


        $responseFormate = [
            'type'        => 'json_schema',
            'json_schema' => [
                'name'   => 'blog_post',
                'schema' => [
                    'type'       => 'object',
                    'properties' => [
                        'data' => [
                            'type'       => 'object',
                            'properties' => [
                                'blog_post' => ['type' => 'string'],
                            ],
                            'required'             => ['blog_post'],
                            'additionalProperties' => false,
                        ],
                    ],
                    'required'             => ['data'],
                    'additionalProperties' => false,
                ],
                'strict' => true,
            ],
        ];

        $prompt = "Generate a full blog post based on the following data:
    - Topic: {$topic}
    - Main Keyword: {$mainKeyword}
    - Related Keywords: {$newRelatedKeywords}
    - Title: {$title}
    - Meta Description: {$metaDescription}
    - Outline: {$newOutline} 
    - Number of words: {$numberOfBlogWord}
    - Language: {$language}
    - Tone: {$tone}
    Write the blog post in an engaging and SEO-friendly manner. Do not include any extra text. Give me the response in HTML format.";

        // Call the OpenAI API
        $generatedBlog = $this->callOpenAI($prompt, $responseFormate);

        // If the result is a string, decode it; otherwise, assume it's already an array.
        if (is_string($generatedBlog)) {
            $data = json_decode($generatedBlog, true);
        } else {
            $data = $generatedBlog;
        }

        // Check if decoding was successful
        if (!isset($data['data']['blog_post'])) {
            return response()->json(['error' => 'Invalid response received from the API.'], 500);
        }

        return response()->json(
            ["content" => $data],
            200,
            ['Content-Type' => 'application/json'],
            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
        );
    }

    public function getSingleBlogPost($id)
    {
        $blogData = BlogData::where('id', $id)->first();
        if (!$blogData) {
            return response()->json(['error' => 'No blog data found'], 400);
        }

        return Inertia::render('BlogPostGenerator', ['blogData' => $blogData]);
    }



    public function deleteSingleBlogPost($id)
    {
        $blogData = BlogData::where('id', $id)->first();
        if (!$blogData) {
            return response()->json(['error' => 'No blog data found'], 400);
        }
        $blogData->delete();
        $allBlogData = BlogData::get();
        return Inertia::render('Blog', ['blogData' => $allBlogData]);
        
    }

    public function getAllBlogPost(Request $request){
        try{

            $user = Auth::user()->id;

            if($user === 1){
                $blogData = BlogData::get();
            }else{
                $blogData = BlogData::where('user_id', $user)->get();
            }

            return Inertia::render('Blog', ['blogData' => $blogData]);

        }catch(\Exception $e){
            return response()->json(['error' => 'Error Happen!'], 500);
        }
    }


    public function updateOrCreateBlogData(Request $request)
    {
        try {
            if ($request->blogId !== null) {
                $blogData = BlogData::where('id', $request->blogId)->first();
                if (!$blogData) {
                    return redirect()->back()->with('error', 'Error Happen!');
                }

                $relatedKeywords = null;
                $outline = null;
                if (isset($request->relatedKeywords)) {
                    $blogData->related_keywords = null;
                    $blogData->save();
                    $relatedKeywords = $request->relatedKeywords;
                    foreach ($relatedKeywords as $key => $value) {
                        $relatedKeywords[$key] = $value;
                    }
                }

                if (isset($request->outline)) {
                    $blogData->outline = null;
                    $blogData->save();
                    $outline = $request->outline;
                    foreach ($outline as $key => $value) {
                        $outline[$key] = $value;
                    }
                }


                $blogData->main_keyword = $request->mainKeyword ? $request->mainKeyword : $blogData->main_keyword;
                $blogData->related_keywords = $relatedKeywords ? $relatedKeywords : $blogData->related_keywords;
                $blogData->outline = $outline ? $outline : $blogData->outline;
                $blogData->title = $request->title ? $request->title : $blogData->title;
                $blogData->meta_description = $request->metaDescription ? $request->metaDescription : $blogData->meta_description;
                $blogData->blog_post = $request->blogPost ? $request->blogPost : $blogData->blog_post;
                $blogData->save();
                
                return Inertia::render('BlogPostGenerator', ['blogData' => $blogData]);
            }

            $relatedKeywords = null;
            $outline = null;
            if (isset($request->relatedKeywords)) {
                $relatedKeywords = $request->relatedKeywords;
                foreach ($relatedKeywords as $key => $value) {
                    $relatedKeywords[$key] = $value;
                }
            }
            if (isset($request->outline)) {
                $outline = $request->outline;
                foreach ($outline as $key => $value) {
                    $outline[$key] = $value;
                }
            }

            $blogData = BlogData::create([
                'user_id' => Auth::user()->id,
                'topic' => $request->topic ? $request->topic : null,
                'main_keyword' => $request->mainKeyword ? $request->mainKeyword : null,
                'related_keywords' => $relatedKeywords ? $relatedKeywords : null,
                'title' => $request->title ? $request->title : null,
                'meta_description' => $request->metaDescription ? $request->metaDescription : null,
                'outline' => $outline ? $outline : null,
                'blog_post' => $request->blogPost ? $request->blogPost : null,
            ]);

            if (!$blogData) {
                return redirect()->back()->with('error', 'Error Happen!');
            }

            return Inertia::render('BlogPostGenerator', ['blogData' => $blogData]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error Happen!');
        }
    }
}
