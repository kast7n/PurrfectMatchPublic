import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserInfoQuery } from "../../features/account/accountApi";

export default function RequireAdminAuth() {
    const { data: user, isLoading } = useUserInfoQuery();
    const location = useLocation();

    if (isLoading) return <div>Loading...</div>;
    
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} />;
    }
    
    if (!user.roles?.includes('Admin')) {
        return <Navigate to="/dashboard" state={{ from: location }} />;
    }

    return <Outlet />;
}
