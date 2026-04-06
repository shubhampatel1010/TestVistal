import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import "./PdfViewerPage.css";
import { useEffect, useMemo } from "react";

export default function PdfViewerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const state = location.state as {
    pdf?: string;
    page?: number;
    title?: string;
  };

  // Prefer state, fallback to URL query params (survives reload)
  const pdf = state?.pdf || searchParams.get("pdf") || "";
  const page = state?.page || parseInt(searchParams.get("page") || "1", 10);
  const title = state?.title || searchParams.get("title") || "PDF Viewer";

  // Sync state to URL params so reload works
  useEffect(() => {
    if (state?.pdf && !searchParams.get("pdf")) {
      setSearchParams(
        { pdf: state.pdf, page: String(state.page || 1), title: state.title || "PDF Viewer" },
        { replace: true }
      );
    }
  }, [state?.pdf]);

  useEffect(() => {
    const disableRightClick = (e: MouseEvent) => e.preventDefault();

    const disableShortcuts = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (e.ctrlKey && ["s", "p", "u", "c", "a"].includes(key)) {
        e.preventDefault();
      }

      if (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) {
        e.preventDefault();
      }

      if (key === "f12" || key === "printscreen") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("keydown", disableShortcuts);

    document.body.style.userSelect = "none";
    (document.body.style as any).webkitUserSelect = "none";

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", disableShortcuts);
      document.body.style.userSelect = "";
      (document.body.style as any).webkitUserSelect = "";
    };
  }, []);

  // Force fresh load every time page opens
  const cacheBuster = useMemo(() => Date.now(), []);

  if (!pdf) {
    return (
      <div className="pdf-viewer-empty">
        <button className="pdf-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </button>
        <p>PDF not found.</p>
      </div>
    );
  }

  const iframeSrc = `${window.location.origin}/mobile-pdf-viewer.html?file=${encodeURIComponent(`/${pdf}?v=${cacheBuster}`)}&page=${page}`;

  return (
    <div className="pdf-viewer-page">
      <div className="pdf-topbar">
        <button className="pdf-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </button>

        <h2 className="pdf-title">{title}</h2>
      </div>

      <div className="pdf-frame-wrapper">
        <iframe
          key={iframeSrc}
          src={iframeSrc}
          title={title}
          className="pdf-frame"
        />
      </div>

      <div className="pdf-protection-note">Protected View Only</div>
    </div>
  );
}