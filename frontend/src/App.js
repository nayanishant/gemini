import ProtectedRoute from "./ProtectedRoute";
import { BrowserRouter as Router} from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <ProtectedRoute />
      </Router>
    </div>
  );
}

export default App;