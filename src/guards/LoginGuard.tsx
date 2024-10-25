import { Navigate, Outlet } from "react-router-dom";

const LoginGuard = () => {
    const data=localStorage.getItem("dataEleRose");
  return data ? <Navigate replace to={`/dashboard`}/>:<Outlet/> ;
}
export default LoginGuard;
