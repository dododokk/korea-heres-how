import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/auth";

// 로그인하지 않았으면 안쪽 화면 대신 로그인 화면으로 보낸다.
export default function RequireAuth() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
