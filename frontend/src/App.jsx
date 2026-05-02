import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useUserStore from "./store/userStore";
import Onboarding from "./pages/Onboarding";
import Login      from "./pages/Login";        
import Dashboard  from "./pages/Dashboard";
import LogFood    from "./pages/LogFood";
import Summary    from "./pages/Summary";

function PrivateRoute({ children }) {
  const token = useUserStore((s) => s.token);
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="max-w-md mx-auto min-h-screen">
        <Routes>
          <Route path="/"          element={<Onboarding />} />
          <Route path="/login"     element={<Login />} />   {}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/log"       element={<PrivateRoute><LogFood /></PrivateRoute>} />
          <Route path="/summary"   element={<PrivateRoute><Summary /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}