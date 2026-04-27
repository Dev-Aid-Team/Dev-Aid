import { useState, useRef, useCallback } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/tools/ImageConverter.css";

const FORMATS = ["jpeg", "png", "webp", "gif", "bmp"];

const FORMAT_LABELS = {
  jpeg: "JPEG",
  png: "PNG",
  webp: "WebP",
  gif: "GIF",
  bmp: "BMP",
};

const FORMAT_MIME = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  bmp: "image/bmp",
};

function formatBytes(bytes) {
  if (!bytes) return "–";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getExtension(format) {
  return format === "jpeg" ? "jpg" : format;
}

export default function ImageConverter() {
  const [images, setImages] = useState([]);
  const [targetFormat, setTargetFormat] = useState("webp");
  const [quality, setQuality] = useState(92);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processFiles = useCallback((files) => {
    const imageFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!imageFiles.length) return;

    const newImages = imageFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      originalSize: file.size,
      originalType: file.type,
      previewUrl: URL.createObjectURL(file),
      status: "ready", // ready | converting | done | error
      outputUrl: null,
      outputSize: null,
    }));

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e) => {
    processFiles(e.target.files);
    e.target.value = "";
  };

  const convertImage = (img) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext("2d");

        // For formats that don't support transparency, fill white background
        if (targetFormat === "jpeg" || targetFormat === "bmp") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(image, 0, 0);

        const mime = FORMAT_MIME[targetFormat];
        const qualityValue =
          targetFormat === "jpeg" || targetFormat === "webp"
            ? quality / 100
            : undefined;

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve({ error: true });
            const url = URL.createObjectURL(blob);
            resolve({ url, size: blob.size });
          },
          mime,
          qualityValue
        );
      };
      image.onerror = () => resolve({ error: true });
      image.src = img.previewUrl;
    });
  };

  const handleConvertAll = async () => {
    const toConvert = images.filter((img) => img.status === "ready");
    if (!toConvert.length) return;

    // Mark all as converting
    setImages((prev) =>
      prev.map((img) =>
        img.status === "ready" ? { ...img, status: "converting" } : img
      )
    );

    for (const img of toConvert) {
      const result = await convertImage(img);
      setImages((prev) =>
        prev.map((i) =>
          i.id === img.id
            ? result.error
              ? { ...i, status: "error" }
              : {
                  ...i,
                  status: "done",
                  outputUrl: result.url,
                  outputSize: result.size,
                }
            : i
        )
      );
    }
  };

  const handleDownload = (img) => {
    if (!img.outputUrl) return;
    const a = document.createElement("a");
    a.href = img.outputUrl;
    const baseName = img.name.replace(/\.[^/.]+$/, "");
    a.download = `${baseName}.${getExtension(targetFormat)}`;
    a.click();
  };

  const handleDownloadAll = () => {
    images.filter((i) => i.status === "done").forEach(handleDownload);
  };

  const handleRemove = (id) => {
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearAll = () => setImages([]);

  const handleResetReady = () => {
    setImages((prev) =>
      prev.map((img) =>
        img.status === "done" || img.status === "error"
          ? { ...img, status: "ready", outputUrl: null, outputSize: null }
          : img
      )
    );
  };

  const doneCount = images.filter((i) => i.status === "done").length;
  const readyCount = images.filter((i) => i.status === "ready").length;
  const hasImages = images.length > 0;

  const supportsQuality = targetFormat === "jpeg" || targetFormat === "webp";

  return (
    <>
      <Header />
      <div className="container">
        {/* Header */}
        <div className="header-section">
          <h1>Image Converter</h1>
          <p>
            Convert images to different formats — losslessly or with adjustable
            quality.
          </p>
        </div>

        <div className="grid-layout">
          {/* Drop Zone */}
          <div className="full-width">
            <div
              className={`ic-dropzone card ${
                isDragging ? "ic-dropzone--active" : ""
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && fileInputRef.current?.click()
              }
            >
              <div className="ic-dropzone-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="ic-dropzone-text">
                Drop images here or click to browse
              </p>
              <p className="ic-dropzone-hint">
                PNG, JPEG, WebP, GIF, BMP supported
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleFileInput}
              />
            </div>
          </div>

          {/* Settings */}
          <div className="card">
            <div className="card-header">
              <h3>Output Format</h3>
            </div>
            <div className="card-content">
              <div className="ic-format-grid">
                {FORMATS.map((fmt) => (
                  <button
                    key={fmt}
                    className={`ic-format-btn ${
                      targetFormat === fmt ? "ic-format-btn--active" : ""
                    }`}
                    onClick={() => setTargetFormat(fmt)}
                  >
                    {FORMAT_LABELS[fmt]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Quality</h3>
              <span className="card-subtitle">
                {supportsQuality ? `${quality}%` : "N/A for this format"}
              </span>
            </div>
            <div className="card-content">
              <input
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="ic-quality-slider"
                disabled={!supportsQuality}
              />
              <div className="ic-quality-labels">
                <span>Smaller file</span>
                <span>Best quality</span>
              </div>
            </div>
          </div>

          {/* Action row */}
          {hasImages && (
            <div className="full-width action-row">
              <button
                className="btn btn-primary"
                onClick={handleConvertAll}
                disabled={readyCount === 0}
              >
                Convert{" "}
                {readyCount > 0
                  ? `${readyCount} image${readyCount > 1 ? "s" : ""}`
                  : ""}
              </button>
              {doneCount > 0 && (
                <button
                  className="btn btn-secondary"
                  onClick={handleDownloadAll}
                >
                  Download all ({doneCount})
                </button>
              )}
              <button className="btn btn-outline" onClick={handleClearAll}>
                Clear all
              </button>
            </div>
          )}

          {/* Image list */}
          {hasImages && (
            <div className="full-width card">
              <div className="card-header">
                <h3>Images</h3>
                <div className="action-buttons">
                  {doneCount > 0 && (
                    <button
                      className="btn-ghost btn"
                      onClick={handleResetReady}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
              <div className="card-content">
                <ul className="ic-image-list">
                  {images.map((img) => (
                    <li key={img.id} className="ic-image-item">
                      <img
                        src={img.previewUrl}
                        alt={img.name}
                        className="ic-image-thumb"
                      />
                      <div className="ic-image-info">
                        <span className="ic-image-name">{img.name}</span>
                        <span className="ic-image-meta">
                          {formatBytes(img.originalSize)}
                          {img.outputSize && (
                            <>
                              {" → "}
                              <span
                                className={
                                  img.outputSize < img.originalSize
                                    ? "ic-size-smaller"
                                    : "ic-size-larger"
                                }
                              >
                                {formatBytes(img.outputSize)}
                              </span>
                              {img.outputSize < img.originalSize && (
                                <span className="ic-size-badge">
                                  −
                                  {Math.round(
                                    (1 - img.outputSize / img.originalSize) *
                                      100
                                  )}
                                  %
                                </span>
                              )}
                            </>
                          )}
                        </span>
                      </div>
                      <div className="ic-image-status">
                        {img.status === "ready" && (
                          <span className="ic-status ic-status--ready">
                            Ready
                          </span>
                        )}
                        {img.status === "converting" && (
                          <span className="ic-status ic-status--converting">
                            <span className="ic-spinner" /> Converting…
                          </span>
                        )}
                        {img.status === "done" && (
                          <button
                            className="btn btn-primary ic-dl-btn"
                            onClick={() => handleDownload(img)}
                          >
                            ↓ Download
                          </button>
                        )}
                        {img.status === "error" && (
                          <span className="ic-status ic-status--error">
                            Error
                          </span>
                        )}
                      </div>
                      <button
                        className="btn-ghost btn ic-remove-btn"
                        onClick={() => handleRemove(img.id)}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Info card */}
          <div className="full-width card">
            <div className="card-header">
              <h3>Format Guide</h3>
            </div>
            <div className="card-content">
              <ul className="info-list">
                <li>
                  <strong>WebP</strong> — Best for web: smaller files than
                  JPEG/PNG with great quality. Supports transparency.
                </li>
                <li>
                  <strong>JPEG</strong> — Universal compatibility, adjustable
                  compression. No transparency support.
                </li>
                <li>
                  <strong>PNG</strong> — Lossless with transparency. Larger
                  files, ideal for graphics & screenshots.
                </li>
                <li>
                  <strong>GIF</strong> — 256 colors only. Limited use; prefer
                  WebP for animations.
                </li>
                <li>
                  <strong>BMP</strong> — Uncompressed. Very large files, rarely
                  needed outside Windows workflows.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
