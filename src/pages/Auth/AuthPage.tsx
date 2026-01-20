import { Outlet } from "react-router-dom";

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <Outlet />
    </div>
  );
};

export default AuthPage;
