import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { LoadingPage } from "./LoadingPage";

export function ProtectedRoute({ children }) {
  const { isLoading, isAuth } = useContext(AuthContext);
  if (isLoading) {
    return <LoadingPage></LoadingPage>;
  }
  return isAuth ? children : <Navigate to="/login" replace="true" />;
}
