 
import React, { useState } from "react";
import { Puck, Render, PuckPreview } from "@measured/puck";  
import "@measured/puck/puck.css";
 
const config = {
  categories: [
    { title: "Layout", id: "layout" },
    { title: "Typography", id: "typography" },
    { title: "Media", id: "media" },
    { title: "Actions", id: "actions" },
    { title: "Blocks", id: "blocks" },
  ],
  components: {
    Heading: {
      group: "Typography",
      fields: {
        text: { type: "text", label: "Heading Text", defaultValue: "Heading" },
        level: {
          type: "select",
          label: "Level",
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
          ],
          defaultValue: "h2",
        },
      },
      render: ({ text, level }) => {
        const Tag = level || "h2";
        return <Tag>{text}</Tag>;
      },
    },
    Paragraph: {
      group: "Typography",
      fields: {
        text: { type: "textarea", label: "Paragraph Text", defaultValue: "Write something..." },
      },
      render: ({ text }) => <p>{text}</p>,
    },
    Image: {
      group: "Media",
      fields: {
        src: { type: "text", label: "Image URL", defaultValue: "" },
        alt: { type: "text", label: "Alt Text", defaultValue: "" },
      },
      render: ({ src, alt }) => (
        <img src={src} alt={alt} style={{ maxWidth: "100%" }} />
      ),
    },
    Button: {
      group: "Actions",
      fields: {
        label: { type: "text", label: "Button Label", defaultValue: "Click Me" },
        href: { type: "text", label: "Link URL", defaultValue: "#" },
      },
      render: ({ label, href }) => (
        <a href={href} style={{ padding: "8px 16px", background: "#0366d6", color: "#fff", borderRadius: 4, textDecoration: "none" }}>
          {label}
        </a>
      ),
    },
    Card: {
      group: "Blocks",
      fields: {
        title: { type: "text", label: "Card Title", defaultValue: "Card Title" },
        content: { type: "textarea", label: "Card Content", defaultValue: "Some description..." },
        image: { type: "text", label: "Image URL", defaultValue: "" },
      },
      render: ({ title, content, image }) => (
        <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 20, maxWidth: 400 }}>
          {image && <img src={image} alt={title} style={{ maxWidth: "100%", marginBottom: 10 }} />}
          <h3>{title}</h3>
          <p>{content}</p>
        </div>
      ),
    },
    Accordion: {
      group: "Blocks",
      fields: {
        items: {
          type: "array",
          label: "Accordion Items",
          of: {
            type: "object",
            fields: {
              title: { type: "text", label: "Item Title", defaultValue: "Title" },
              content: { type: "textarea", label: "Content", defaultValue: "Content goes here..." },
            }
          },
          defaultValue: [],
        },
      },
      render: ({ items }) => {
        if (!Array.isArray(items)) return null;
        return (
          <div>
            {items.map((item, idx) => (
              <details key={idx} style={{ marginBottom: 10 }}>
                <summary>{item.title}</summary>
                <p>{item.content}</p>
              </details>
            ))}
          </div>
        );
      },
    },
  },
};

const CreatePage = () => {
  const [data, setData] = useState({ content: [] });

  const handlePublish = (updatedData) => {
    console.log("Published data:", updatedData);
    setData(updatedData);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "10px 20px", background: "#f5f5f5", borderBottom: "1px solid #ddd" }}>
        <h1 style={{ margin: 0 }}>Puck Editor Clone</h1>
      </div>
      <div style={{ flex: 1 }}>
        <Puck
          config={config}
          data={data}
          onPublish={handlePublish}
        />
      </div>
    </div>
  );
};

export default CreatePage;
