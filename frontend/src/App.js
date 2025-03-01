import ProtectedRoute from "./ProtectedRoute";
import { BrowserRouter as Router} from "react-router-dom";
import "./App.css";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="App">
      <Router>
        <ProtectedRoute />
        <Toaster />
      </Router>
    </div>
  );
}

export default App;