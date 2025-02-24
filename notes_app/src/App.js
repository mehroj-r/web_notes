import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmptyPlaceholder from "./components/empty-page";
import Menu from "./components/menu";
import Note from "./components/Note";

function App() {
  return (
      <Router>
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
          <Routes>
            <Route path="/menu" element={<Menu />} />
            <Route path="/empty-placeholder" element={<EmptyPlaceholder />} />
            <Route path="/notes" element={<Note />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
