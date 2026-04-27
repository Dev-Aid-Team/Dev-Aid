import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="container">
      <Header />

      <section className="hero">
        <h1>Your Dev-Tools.</h1>
        <p>Open source toolbox for programming</p>
      </section>

      <section className="content-section">
        <h2 className="section-title">Tool-Overview</h2>
        <div className="content-list">
          <Link to="/jsonFormatter" className="content-item">
            <div className="content-item-header">
              <span className="content-item-title">JSON Formatter</span>
              <span className="content-item-tag">Formatter</span>
            </div>
            <p className="content-item-desc">Problems with reading JSON?</p>
          </Link>

          <Link to="/colorPicker" className="content-item">
            <div className="content-item-header">
              <span className="content-item-title">Color Picker</span>
              <span className="content-item-tag">Design</span>
            </div>
            <p className="content-item-desc">
              Problems finding the right color?
            </p>
          </Link>

          <Link to="/regex" className="content-item">
            <div className="content-item-header">
              <span className="content-item-title">
                Regex Tester & Validator
              </span>
              <span className="content-item-tag">Validator</span>
            </div>
            <p className="content-item-desc">Problems with Regex?</p>
          </Link>

          <Link to="/imageConverter" className="content-item">
            <div className="content-item-header">
              <span className="content-item-title">Image Converter</span>
              <span className="content-item-tag">Converter</span>
            </div>
            <p className="content-item-desc">
              Convert images between PNG, JPEG, WebP and more — right in your
              browser.
            </p>
          </Link>
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
