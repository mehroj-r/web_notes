import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmptyPlaceholder from "./components/empty-page";
import Menu from "./components/menu";

function App() {
  return (
      <Router>
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
          <Routes>
            <Route path="/menu" element={<Menu />} />
            <Route path="/empty-placeholder" element={<EmptyPlaceholder />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
