import { useEffect, Suspense, lazy } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./redux/features/userSlice.js";
import Loading from "./components/loading/loading";

const SignIn = lazy(() => import("./components/auth/auth.jsx"));
const Main = lazy(() => import("./pages/main/main.jsx"));

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user);

  useEffect(() => {
    if (!userInfo.isLoggedIn) {
      // localStorage.removeItem("persist:root");
      // localStorage.removeItem("token");
      // localStorage.removeItem("sessionId")
      localStorage.clear()
      dispatch(logout());
      navigate("/")
    }
  }, [userInfo.isLoggedIn, dispatch, navigate]);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/chat" element={userInfo.isLoggedIn ? <Main /> : <Navigate to='/' />} />
      </Routes>
    </Suspense>
  );
};

export default ProtectedRoute;
