import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Home from "./pages/Home";
import JsonFormatter from "./tools/JsonFormatter";
import ColorPicker from "./tools/ColorPicker";
import RegexTesterValidater from "./tools/RegexTesterValidater";
import AboutUs from "./pages/AboutUs";
import "./App.css";
import ImageConverter from "./tools/ImageConverter";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jsonFormatter" element={<JsonFormatter />} />
        <Route path="/colorPicker" element={<ColorPicker />} />
        <Route path="/regex" element={<RegexTesterValidater />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/imageConverter" element={<ImageConverter />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
