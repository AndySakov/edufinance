import React from "react";
import Layout from ".";

export interface AdminLayoutProps {
  title: string;
  requiredPermissions?: string[];
}

const AdminPage = (props: React.PropsWithChildren<AdminLayoutProps>) => {
  return (
    <Layout
      title={props.title}
      requiredRoles={["admin", "super-admin"]}
      requiredPermissions={props.requiredPermissions}
    >
      {props.children}
    </Layout>
  );
};

export default AdminPage;
