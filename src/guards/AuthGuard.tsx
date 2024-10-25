import { Navigate, Outlet } from "react-router-dom";

const AuthGuard = () => {
    const data=localStorage.getItem("dataEleRose");
  return data ? <Outlet/>:<Navigate replace to={"/login"}/> ;
}

export default AuthGuard;
