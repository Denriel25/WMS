import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentPages.css";

function StudentLibrary() {
  const navigate = useNavigate();
  const libraryUrl = "/LibraryLink_LibraryManagementSystems/index.html";

  const handleOpenLibrary = useCallback(() => {
    window.location.href = libraryUrl;
  }, [libraryUrl]);

  return (
    <div className="student-page">
      <div className="student-header">
        <div>
          <h1>Library Portal</h1>
          <p>Access the student library management system from here.</p>
        </div>
      </div>

      <div className="student-library-card">
        <p>
          This will open the LibraryLink student portal. If the embedded view does not load,
          use the direct link below.
        </p>

        <div className="student-library-actions">
          <button className="student-action-btn" onClick={handleOpenLibrary}>
            Open Library Portal
          </button>
          <button className="student-secondary-btn" onClick={() => navigate("/student/dashboard")}> 
            Back to Dashboard
          </button>
        </div>

        <div className="student-library-link">
          <p>Direct URL:</p>
          <a href={libraryUrl} target="_blank" rel="noopener noreferrer">{libraryUrl}</a>
        </div>
      </div>
    </div>
  );
}

export default StudentLibrary;
