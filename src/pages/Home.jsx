import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/home/Home.css";

const TOOLS = [
  {
    path: "/jsonFormatter",
    title: "JSON Formatter",
    tag: "Formatter",
    desc: "Problems with reading JSON?",
    categories: ["backend", "formatter"],
  },
  {
    path: "/colorPicker",
    title: "Color Picker",
    tag: "Design",
    desc: "Problems finding the right color?",
    categories: ["frontend", "design"],
  },
  {
    path: "/regex",
    title: "Regex Tester & Validator",
    tag: "Validator",
    desc: "Problems with Regex?",
    categories: ["backend", "frontend", "validator"],
  },
  {
    path: "/imageConverter",
    title: "Image Converter",
    tag: "Converter",
    desc: "Convert images between PNG, JPEG, WebP and more — right in your browser.",
    categories: ["frontend", "design", "converter"],
  },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "design", label: "Design" },
  { id: "formatter", label: "Formatter" },
  { id: "validator", label: "Validator" },
  { id: "converter", label: "Converter" },
];

function Home() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? TOOLS
      : TOOLS.filter((t) => t.categories.includes(activeFilter));

  return (
    <div className="container">
      <Header />

      <section className="hero">
        <h1>Your Dev-Tools.</h1>
        <p>Open source toolbox for programming</p>
      </section>

      <section className="content-section">
        <h2 className="section-title">Tool-Overview</h2>

        {/* Filter Buttons */}
        <div className="home-filter-bar">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`home-filter-btn${
                activeFilter === f.id ? " home-filter-btn--active" : ""
              }`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Tool List */}
        <div className="content-list">
          {filtered.length === 0 ? (
            <p className="home-no-results">No tools match this filter.</p>
          ) : (
            filtered.map((tool) => (
              <Link key={tool.path} to={tool.path} className="content-item">
                <div className="content-item-header">
                  <span className="content-item-title">{tool.title}</span>
                  <span className="content-item-tag">{tool.tag}</span>
                </div>
                <p className="content-item-desc">{tool.desc}</p>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="stats">
        <div className="stat">
          <div className="stat-content">04</div>
          <div className="stat-label">Tools available</div>
        </div>
        <div className="stat">
          <div className="stat-content">00</div>
          <div className="stat-label">Registrations required</div>
        </div>
        <div className="stat">
          <div className="stat-content">∞</div>
          <div className="stat-label">Forever free</div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
