import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
import AuthProvider from "./context/AuthContext";
import ForgotPasswordPage from "./pages/Auth/ForgotPassword";
import ResetPasswordPage from "./pages/Auth/ResetPassword";
import ThreadsPage from "./pages/Threads";
import Threads from "./pages/Threads/Threads";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />}>
              <Route path="login" index element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
            </Route>
            <Route path="/" element={<ThreadsPage />}>
              <Route index element={<Threads />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
