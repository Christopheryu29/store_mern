import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";

export default function PrivateOwnerRoute() {
  const { currentUser } = useSelector((state: RootState) => state.user) as {
    currentUser: { role: "owner" | "cashier" } | null;
  };

  return currentUser?.role === "owner" ? <Outlet /> : <Navigate to="/" />;
}
