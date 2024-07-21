import Unauthorized from "@/pages/utility/unauthorized";
import { useAuth } from "@/shared/store";
import { Role } from "@/shared/types/user";
import React, { useEffect } from "react";
import Sidebar from "../sidebar";
import Header from "../header";
import { Toaster } from "../toaster";
import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/hooks/use-toast";

export interface LayoutProps {
  title: string;
  requiredRoles?: Role[];
  requiredPermissions?: string[];
}

const Layout = (props: React.PropsWithChildren<LayoutProps>) => {
  const { user } = useAuth();
  const { state } = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (state?.toast) {
      toast(state.toast);
    }
  }, [state?.toast, toast]);

  const isSuperAdmin = user?.role === "super-admin";

  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }

  if (!isSuperAdmin) {
    if (props.requiredRoles && !props.requiredRoles.includes(user?.role)) {
      return <Unauthorized />;
    }

    if (
      props.requiredPermissions &&
      !props.requiredPermissions.every((permission) =>
        user?.permissions.includes(permission)
      )
    ) {
      return <Unauthorized />;
    }
  }

  return (
    <div className="flex h-screen max-h-screen">
      <Sidebar role={user?.role} />

      <main className="flex-1 bg-white p-8 max-h-screen overflow-auto">
        <div className="p-4">
          <Header title={props.title} />
          {props.children}
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;
