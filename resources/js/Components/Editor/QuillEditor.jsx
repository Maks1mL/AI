
import React from "react";
import { Editor } from "primereact/editor";

const QuillEditor = ({text ,setText}) => {
    
    // Handle text change
    const handleTextChange = (e) => {
        setText(e.htmlValue);
    };

    // Full toolbar configuration
    const renderHeader = () => {
        return (
            <span className="ql-formats">
                {/* Basic Formatting */}
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
                <button className="ql-strike" aria-label="Strikethrough"></button>

                {/* Headings */}
                <select className="ql-header" defaultValue="">
                    <option value="1">H1</option>
                    <option value="2">H2</option>
                    <option value="3">H3</option>
                    <option value="">Normal</option>
                </select>

                {/* Block Elements */}
                <button className="ql-blockquote" aria-label="Blockquote"></button>
                <button className="ql-code-block" aria-label="Code Block"></button>

                {/* Lists */}
                <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
                <button className="ql-list" value="bullet" aria-label="Bullet List"></button>

                {/* Indentation */}
                <button className="ql-indent" value="-1" aria-label="Decrease Indent"></button>
                <button className="ql-indent" value="+1" aria-label="Increase Indent"></button>

                {/* Script (Subscript & Superscript) */}
                <button className="ql-script" value="sub" aria-label="Subscript"></button>
                <button className="ql-script" value="super" aria-label="Superscript"></button>

                {/* Alignment */}
                <select className="ql-align" defaultValue="">
                    <option value="" label="Left"></option>
                    <option value="center" label="Center"></option>
                    <option value="right" label="Right"></option>
                    <option value="justify" label="Justify"></option>
                </select>

                {/* Direction (LTR/RTL) */}
                <button className="ql-direction" value="rtl" aria-label="Right to Left"></button>

                {/* Font Size */}
                <select className="ql-size" defaultValue="normal">
                    <option value="small">Small</option>
                    <option value="normal">Normal</option>
                    <option value="large">Large</option>
                    <option value="huge">Huge</option>
                </select>

                {/* Font Family */}
                <select className="ql-font" defaultValue="sans-serif">
                    <option value="sans-serif">Sans-Serif</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                </select>

                {/* Colors */}
                <button className="ql-color" aria-label="Text Color"></button>
                <button className="ql-background" aria-label="Background Color"></button>

                {/* Media */}
                <button className="ql-link" aria-label="Insert Link"></button>
                <button className="ql-image" aria-label="Insert Image"></button>
                <button className="ql-video" aria-label="Insert Video"></button>

                {/* Remove Formatting */}
                <button className="ql-clean" aria-label="Remove Formatting"></button>
            </span>
        );
    };

    return (
        <div className=" bg-white ">
            <Editor
                value={text}
                headerTemplate={renderHeader()}
                onTextChange={handleTextChange}
                style={{ border:"none"}}
                className="h-[230px] 2xl:h-[460px]"
            />
        </div>
    );
};

export default QuillEditor;
