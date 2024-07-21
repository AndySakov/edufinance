import { createBrowserRouter, Outlet } from "react-router-dom";
import Login from "./login";
import NotFound from "./utility/not-found";
import App from "./app";
import AdminDashboard from "./admin/dashboard";
import StudentDashboard from "./student/dashboard";
import ViewAllStudents from "./admin/students";
import ViewStudent from "./admin/students/view";
import ViewAllUsers from "./admin/users";
import ViewUser from "./admin/users/view";
import ViewAllProgrammes from "./admin/programmes";
import ViewProgramme from "./admin/programmes/view";
import ViewAllPaymentCategories from "./admin/payment-categories";
import ViewPaymentCategory from "./admin/payment-categories/view";
import ViewAllBillTypes from "./admin/bill-types";
import ViewBillType from "./admin/bill-types/view";
import ViewAllBills from "./admin/bills";
import ViewBill from "./admin/bills/view";
import ViewAllFinancialAidCategories from "./admin/financial-aid/categories";
import ViewFinancialAidCategory from "./admin/financial-aid/categories/view";
import ViewAllFinancialAidDiscounts from "./admin/financial-aid/discounts";
import ViewFinancialAidDiscount from "./admin/financial-aid/discounts/view";
import ViewAllFinancialAidApplications from "./admin/financial-aid/applications";
import ViewAllTransactions from "./admin/payments";
import ViewMyPayments from "./student/payments";
import ViewMyBills from "./student/bills";
import ViewMyFAApplications from "./student/applications";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <Outlet />,
    children: [
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/students",
        element: <ViewAllStudents />,
      },
      {
        path: "/admin/students/:id",
        element: <ViewStudent />,
      },
      {
        path: "/admin/users",
        element: <ViewAllUsers />,
      },
      {
        path: "/admin/users/:id",
        element: <ViewUser />,
      },
      {
        path: "/admin/programmes",
        element: <ViewAllProgrammes />,
      },
      {
        path: "/admin/programmes/:id",
        element: <ViewProgramme />,
      },
      {
        path: "/admin/bills",
        element: <ViewAllBills />,
      },
      {
        path: "/admin/bills/:id",
        element: <ViewBill />,
      },
      {
        path: "/admin/bills/types",
        element: <ViewAllBillTypes />,
      },
      {
        path: "/admin/bills/types/:id",
        element: <ViewBillType />,
      },
      {
        path: "/admin/payments",
        element: <ViewAllTransactions />,
      },
      {
        path: "/admin/payments/categories",
        element: <ViewAllPaymentCategories />,
      },
      {
        path: "/admin/payments/categories/:id",
        element: <ViewPaymentCategory />,
      },
      {
        path: "/admin/financial-aid/categories",
        element: <ViewAllFinancialAidCategories />,
      },
      {
        path: "/admin/financial-aid/categories/:id",
        element: <ViewFinancialAidCategory />,
      },
      {
        path: "/admin/financial-aid/discounts",
        element: <ViewAllFinancialAidDiscounts />,
      },
      {
        path: "/admin/financial-aid/discounts/:id",
        element: <ViewFinancialAidDiscount />,
      },
      {
        path: "/admin/financial-aid/applications",
        element: <ViewAllFinancialAidApplications />,
      },
    ],
  },
  {
    path: "/student",
    element: <Outlet />,
    children: [
      {
        path: "/student/dashboard",
        element: <StudentDashboard />,
      },
      {
        path: "/student/bills",
        element: <ViewMyBills />,
      },
      {
        path: "/student/payments",
        element: <ViewMyPayments />,
      },
      {
        path: "/student/financial-aid/applications",
        element: <ViewMyFAApplications />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
