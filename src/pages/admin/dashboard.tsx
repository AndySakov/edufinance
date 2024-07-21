import AdminPage from "@/components/ui/page/admin";
import { StatGroup } from "@/components/ui/stat-group";
import { AdminPermissions } from "@/shared/constants";
import { useAuth } from "@/shared/store";
import { MoneyWavy } from "@phosphor-icons/react";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <AdminPage
      title="Overview"
      requiredPermissions={[AdminPermissions.DASHBOARD_ACCESS]}
    >
      <StatGroup
        cards={[
          {
            title: "Total Revenue",
            icon: <MoneyWavy className="w-6 h-6" />,
            value: "$45,231.89",
            description: "+20.1% from last month",
            color: "primary",
          },
          {
            title: "Total Revenue",
            icon: <MoneyWavy className="w-6 h-6" />,
            value: "$45,231.89",
            description: "+20.1% from last month",
            color: "primary",
          },
          {
            title: "Total Revenue",
            icon: <MoneyWavy className="w-6 h-6" />,
            value: "$45,231.89",
            description: "+20.1% from last month",
            color: "primary",
          },
          {
            title: "Total Revenue",
            icon: <MoneyWavy className="w-6 h-6" />,
            value: "$45,231.89",
            description: "+20.1% from last month",
            color: "primary",
          },
          {
            title: "Total Revenue",
            icon: <MoneyWavy className="w-6 h-6" />,
            value: "$45,231.89",
            description: "+20.1% from last month",
            color: "primary",
          },
        ]}
      />
    </AdminPage>
  );
};

export default AdminDashboard;
