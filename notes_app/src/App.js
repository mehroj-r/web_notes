import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EmptyPlaceholder from "./components/empty-page";
import Menu from "./components/menu";
import Note from "./components/Note";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white flex">
        {/* Menu component always visible on the left */}
        <Menu />
        
        {/* Content area on the right */}
        <div className="flex-1">
          <Routes>
            {/* Redirect root path to empty placeholder */}
            <Route path="/" element={<Navigate to="/notes" replace />} />
            
            {/* Notes list view with empty placeholder */}
            <Route path="/notes" element={<EmptyPlaceholder />} />
            
            {/* Individual note view/edit */}
            <Route path="/notes/:noteId" element={<Note />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;