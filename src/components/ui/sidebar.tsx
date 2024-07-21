import {
  CardStackIcon,
  DashboardIcon,
  // GearIcon,
  GroupIcon,
  IdCardIcon,
  // QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Bank,
  ChalkboardTeacher,
  CurrencyDollarSimple,
  DoorOpen,
  Invoice,
  // QuestionMark,
  Receipt,
  SealPercent,
  Student,
  UserCircleGear,
} from "@phosphor-icons/react";
import Logo from "./logo";
import { useAuth } from "@/shared/store";
import { User } from "@/shared/types/user";
import { Link } from "react-router-dom";
import { AdminPermissions } from "@/shared/constants";
import React from "react";

export interface SidebarProps {
  role: User["role"];
}

export interface SidebarTabProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  requiredPermissions?: string[];
}

const SidebarTab = (props: React.PropsWithChildren<SidebarTabProps>) => {
  return (
    <Link
      to={props.to}
      className="flex items-center hover:bg-gray-700 hover:shadow-md p-2 rounded-sm text-gray-400 hover:text-white"
    >
      {props.icon}
      {props.label}
    </Link>
  );
};

const Sidebar = (props: SidebarProps) => {
  const tabs: SidebarTabProps[] =
    props.role === "student"
      ? [
          {
            icon: <CardStackIcon className="mr-3 w-5 h-5" />,
            label: "Bills",
            to: "/student/bills",
          },
          {
            icon: <Receipt className="mr-3 w-5 h-5" />,
            label: "Payment History",
            to: "/student/payments",
          },
          {
            icon: <IdCardIcon className="mr-3 w-5 h-5" />,
            label: "Financial Aid",
            to: "/student/financial-aid/applications",
          },
        ]
      : [
          {
            icon: <Student className="mr-3 w-5 h-5" />,
            label: "Students",
            to: "/admin/students",
            requiredPermissions: [AdminPermissions.STUDENT_MANAGEMENT],
          },
          {
            icon: <UserCircleGear className="mr-3 w-5 h-5" />,
            label: "Users",
            to: "/admin/users",
            requiredPermissions: [AdminPermissions.USER_MANAGEMENT],
          },
          {
            icon: <ChalkboardTeacher className="mr-3 w-5 h-5" />,
            label: "Programmes",
            to: "/admin/programmes",
            requiredPermissions: [AdminPermissions.PROGRAMME_MANAGEMENT],
          },
          {
            icon: <CardStackIcon className="mr-3 w-5 h-5" />,
            label: "Bills",
            to: "/admin/bills",
            requiredPermissions: [AdminPermissions.FEE_AND_DUES_MANAGEMENT],
          },
          {
            icon: <Invoice className="mr-3 w-5 h-5" />,
            label: "Bill Types",
            to: "/admin/bills/types",
            requiredPermissions: [AdminPermissions.FEE_AND_DUES_MANAGEMENT],
          },
          {
            icon: <CurrencyDollarSimple className="mr-3 w-5 h-5" />,
            label: "Payments",
            to: "/admin/payments",
            requiredPermissions: [AdminPermissions.TRANSACTION_MANAGEMENT],
          },
          {
            icon: <Bank className="mr-3 w-5 h-5" />,
            label: "Payment Categories",
            to: "/admin/payments/categories",
            requiredPermissions: [AdminPermissions.PAYMENT_MANAGEMENT],
          },

          {
            icon: <GroupIcon className="mr-3 w-5 h-5" />,
            label: "Financial Aid Categories",
            to: "/admin/financial-aid/categories",
            requiredPermissions: [
              AdminPermissions.FINANCIAL_AID_GRADES_MANAGEMENT,
            ],
          },
          {
            icon: <SealPercent className="mr-3 w-5 h-5" />,
            label: "Financial Aid Discounts",
            to: "/admin/financial-aid/discounts",
            requiredPermissions: [AdminPermissions.BILL_DISCOUNTS_MANAGEMENT],
          },
          {
            icon: <IdCardIcon className="mr-3 w-5 h-5" />,
            label: "Financial Aid Applications",
            to: "/admin/financial-aid/applications",
            requiredPermissions: [AdminPermissions.FINANCIAL_AID_MANAGEMENT],
          },
          // {
          //   icon: <QuestionMark className="mr-3 w-5 h-5" />,
          //   label: "Support Tickets",
          //   to: "/admin/support/tickets",
          //   requiredPermissions: [AdminPermissions.SUPPORT_AND_HELP_CENTER],
          // },
        ];
  const { user, logout } = useAuth();

  return (
    <aside className="flex flex-col border-white bg-gray-900 my-4 p-2 rounded-xl w-72 max-h-screen text-white sm:overflow-y-scroll ms-4 sm:overscroll-y-contain">
      <div className="flex justify-start items-center bg-gray-900 h-16">
        <Logo variant="light" />
      </div>
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          <SidebarTab
            icon={<DashboardIcon className="mr-3 w-5 h-5" />}
            label="Dashboard"
            to={"/"}
          />
          {...(user?.role === "super-admin"
            ? tabs
            : tabs.filter(
                (tab) =>
                  !(
                    tab.requiredPermissions &&
                    !tab.requiredPermissions.every((permission) =>
                      user?.permissions.includes(permission)
                    )
                  )
              )
          ).map((tab, index) => (
            <SidebarTab
              key={index}
              icon={tab.icon}
              label={tab.label}
              to={tab.to}
            />
          ))}
        </nav>
      </div>
      <div className="border-gray-800 p-4 border-t">
        {/* <nav className="space-y-2">
          <SidebarTab
            to="/admin/support"
            icon={<QuestionMarkCircledIcon className="mr-3 w-5 h-5" />}
            label="Support"
          />
          <SidebarTab
            to="/settings"
            icon={<GearIcon className="mr-3 w-5 h-5" />}
            label="Settings"
          />
        </nav> */}
        <div className="flex justify-between items-center space-x-3 mt-4 p-2">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>{`${user?.details.firstName?.[0].toUpperCase()} ${user?.details.lastName?.[0].toUpperCase()}`}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{`${
                user?.details.firstName ?? ""
              } ${user?.details.lastName ?? ""}`}</p>
              <p className="text-gray-400 text-xs">
                {user?.role === "student"
                  ? "Student"
                  : user?.role === "admin"
                  ? "Admin"
                  : "Super Admin"}
              </p>
            </div>
          </div>
          <DoorOpen
            className="ml-auto w-5 h-5 text-gray-400 cursor-pointer"
            onClick={logout}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
