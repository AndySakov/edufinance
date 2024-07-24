import { toast } from "@/components/hooks/use-toast";
import AdminPage from "@/components/ui/page/admin";
import { Spinner } from "@/components/ui/spinner";
import { StatGroup } from "@/components/ui/stat-group";
import { useClient } from "@/shared/axios";
import { AdminPermissions } from "@/shared/constants";
import { formatNumber } from "@/shared/helpers";
import { useAuth } from "@/shared/store";
import { ResponseWithOptionalData } from "@/shared/types/data";
import { AdminDashboardStats } from "@/shared/types/stats/admin/dashboard";
import { MoneyWavy } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const client = useClient();

  const {
    isLoading: isLoadingDashboardStats,
    isError: isDashboardStatsError,
    data: dashboardStats,
    error: dashboardStatsError,
  } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const { data } = await client.get<
        ResponseWithOptionalData<AdminDashboardStats>
      >("/admin/stats/dashboard");
      if (data.success) {
        return data.data;
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    },
  });

  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <AdminPage
      title="Overview"
      requiredPermissions={[AdminPermissions.DASHBOARD_ACCESS]}
    >
      <div className="gap-0 grid grid-cols-1">
        {isLoadingDashboardStats ? (
          <Spinner />
        ) : isDashboardStatsError ? (
          <div className="flex flex-col justify-center items-center">
            <p className="text-center text-red-500">
              Error loading admin dashboard stats
            </p>
            <p className="text-center text-gray-500 text-sm">
              {dashboardStatsError?.message}
            </p>
          </div>
        ) : (
          <StatGroup
            cards={[
              {
                title: "Total Bills Issued",
                icon: <MoneyWavy className="w-6 h-6" />,
                value: formatNumber(dashboardStats?.totalBillsIssued ?? 0),
                description: "Total amount from bills issued",
                color: "primary",
              },
              {
                title: "Total Bills Paid",
                icon: <MoneyWavy className="w-6 h-6" />,
                value: formatNumber(dashboardStats?.totalPaidBills ?? 0),
                description: "Total amount from paid bills",
                color: "primary",
              },
              {
                title: "Total Unpaid Bills",
                icon: <MoneyWavy className="w-6 h-6" />,
                value: formatNumber(dashboardStats?.totalUnpaidBills ?? 0),
                description: "Total amount from unpaid bills",
                color: "primary",
              },
              {
                title: "Total Bills Overdue",
                icon: <MoneyWavy className="w-6 h-6" />,
                value: formatNumber(dashboardStats?.totalOverDueBills ?? 0),
                description: "Total amount from overdue bills",
                color: "primary",
              },
              {
                title: "Total Discounts Issued",
                icon: <MoneyWavy className="w-6 h-6" />,
                value: formatNumber(dashboardStats?.totalDiscountsIssued ?? 0),
                description: "Total amount from discounts issued",
                color: "primary",
              },
            ]}
          />
        )}
      </div>
    </AdminPage>
  );
};

export default AdminDashboard;
