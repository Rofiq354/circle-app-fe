import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { fetchMe } from "@/store/auth/authThunk";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(fetchMe());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
