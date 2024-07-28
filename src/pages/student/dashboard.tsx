import { toast } from "@/components/hooks/use-toast";
import StudentPage from "@/components/ui/page/student";
import { Spinner } from "@/components/ui/spinner";
import { StatGroup } from "@/components/ui/stat-group";
import { useClient } from "@/shared/axios";
import { formatNumber } from "@/shared/helpers";
import { ResponseWithOptionalData } from "@/shared/types/data";
import { StudentDashboardStats } from "@/shared/types/stats/student/dashboard";
import { studentProfileParser, UserProfile } from "@/shared/types/user";
import { CaretRight, MoneyWavy } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CopyIcon } from "@radix-ui/react-icons";
import { differenceInCalendarYears, format, isBefore } from "date-fns";
import { StudentFeeChart } from "@/components/ui/charts/student/fees";
import { MyPayment } from "@/shared/types/payment";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FinancialAidApplicationForm } from "@/components/ui/forms/financial-aid/application/apply";

const StudentDashboard = () => {
  const client = useClient();
  const navigate = useNavigate();

  const {
    // isLoading: isLoadingProfile,
    // isError: isProfileError,
    data: profile,
    // error: profileError,
  } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const { data } = await client.get<ResponseWithOptionalData<UserProfile>>(
        "/student/profile"
      );
      if (data.success) {
        return studentProfileParser(data.data);
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    },
  });

  const {
    isLoading: isLoadingPayments,
    isError: isPaymentsError,
    data: myPayments,
    error: paymentsError,
  } = useQuery({
    queryKey: ["my-payments"],
    queryFn: async () => {
      const { data } = await client.get<ResponseWithOptionalData<MyPayment[]>>(
        "/student/payments"
      );
      const results = data.data.map((transaction, index) => ({
        ...transaction,
        index: index + 1,
      }));
      return results;
    },
  });

  const {
    isLoading: isLoadingDashboardStats,
    isError: isDashboardStatsError,
    data: dashboardStats,
    error: dashboardStatsError,
  } = useQuery({
    queryKey: ["my-dashboard-stats"],
    queryFn: async () => {
      const { data } = await client.get<
        ResponseWithOptionalData<StudentDashboardStats>
      >("/student/stats/dashboard");
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

  return (
    <StudentPage title="Overview">
      <div className="md:space-y-10 p-6">
        <h1 className="md:block hidden font-semibold text-xl">Your Profile</h1>
        <div className="flex flex-wrap lg:flex-nowrap flex-grow justify-center md:justify-evenly gap-6 mb-6 w-full">
          <div className="flex flex-col justify-center items-center md:items-start space-x-4 space-y-4 w-fit">
            <Avatar className="mx-4 w-24 h-24">
              <AvatarImage src="/placeholder-user.jpg w-full h-full" />
              <AvatarFallback>
                {profile?.firstName?.[0] ?? "" + profile?.lastName?.[0] ?? ""}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-xl">
                {profile?.firstName +
                  " " +
                  profile?.middleName +
                  " " +
                  profile?.lastName}
              </h2>
              <p className="text-muted-foreground">
                {profile?.studentId}{" "}
                <CopyIcon className="inline ml-1 w-4 h-4" />
              </p>
            </div>
          </div>
          <div className="flex flex-wrap md:flex-nowrap justify-evenly gap-6 w-full">
            <div className="flex flex-col gap-4 mx-6">
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{profile?.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone Number</p>
                <p className="font-medium">{profile?.phoneNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Gender</p>
                <p className="font-medium">
                  {profile?.gender?.charAt(0)?.toUpperCase() ??
                    "" + profile?.gender?.slice(1) ??
                    ""}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 mx-6">
              <div>
                <p className="text-muted-foreground">Age</p>
                <p className="font-medium">
                  {profile?.dateOfBirth
                    ? differenceInCalendarYears(
                        new Date(),
                        profile?.dateOfBirth
                      )
                    : 0}{" "}
                  y/o
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">City</p>
                <p className="font-medium">{profile?.city}</p>
              </div>
              <div>
                <p className="text-muted-foreground">State, Country</p>
                <p className="font-medium">
                  {profile?.state ?? "" + ", " + profile?.country ?? ""}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 mx-6">
              <div>
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">{profile?.address}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Zip Code</p>
                <p className="font-medium">{profile?.zipCode}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Nationality</p>
                <p className="font-medium">{profile?.nationality}</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 mx-6">
              <div>
                <p className="text-muted-foreground">Date of Birth</p>
                <p className="font-medium">
                  {profile?.dateOfBirth
                    ? format(profile?.dateOfBirth, "dd-MM-yyyy")
                    : ""}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Programme</p>
                <p className="font-medium">{profile?.programme ?? "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Financial Aid</p>
                <Badge variant="secondary">
                  {profile?.financialAidInfo ? "Approved" : "N/A"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="gap-0 grid grid-cols-1">
          {isLoadingDashboardStats ? (
            <Spinner />
          ) : isDashboardStatsError ? (
            <div className="flex flex-col justify-center items-center">
              <p className="text-center text-red-500">
                Error loading student dashboard stats
              </p>
              <p className="text-center text-gray-500 text-sm">
                {dashboardStatsError?.message}
              </p>
            </div>
          ) : (
            <StatGroup
              cards={[
                {
                  title: "Total Bill Amount",
                  icon: <MoneyWavy className="w-6 h-6" />,
                  value: formatNumber(
                    dashboardStats?.billStats?.totalBills ?? 0
                  ),
                  description: "Total Amount of Expected Bills",
                  color: "primary",
                },
                {
                  title: "Total Discounted Amount",
                  icon: <MoneyWavy className="w-6 h-6" />,
                  value: formatNumber(
                    dashboardStats?.billStats?.totalDiscounted ?? 0
                  ),
                  description: "Total Amount of Discounts Applied",
                  color: "primary",
                },
                {
                  title: "Total Paid Amount",
                  icon: <MoneyWavy className="w-6 h-6" />,
                  value: formatNumber(
                    dashboardStats?.billStats?.totalPaid ?? 0
                  ),
                  description: "Total Amount of Paid Bills",
                  color: "primary",
                },
                {
                  title: "Total Unpaid Bills",
                  icon: <MoneyWavy className="w-6 h-6" />,
                  value: formatNumber(
                    dashboardStats?.billStats?.totalUnpaid ?? 0
                  ),
                  description: "Total Amount of Unpaid Bills",
                  color: "primary",
                },
                {
                  title: "Total Overdue Amount",
                  icon: <MoneyWavy className="w-6 h-6" />,
                  value: formatNumber(
                    dashboardStats?.billStats?.totalOverDue ?? 0
                  ),
                  description: "Total Amount of Overdue Bills",
                  color: "primary",
                },
              ]}
            />
          )}
        </div>
        <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card
              variant="outline"
              className="hover:bg-gray-100 hover:text-card-foreground"
            >
              <CardHeader>
                <CardTitle>Fee Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingPayments ? (
                  <Spinner />
                ) : isPaymentsError ? (
                  <div className="flex flex-col justify-center items-center">
                    <p className="text-center text-red-500">
                      Error loading student dashboard stats
                    </p>
                    <p className="text-center text-gray-500 text-sm">
                      {paymentsError?.message}
                    </p>
                  </div>
                ) : (
                  <StudentFeeChart
                    feesByMonth={
                      myPayments
                        ?.map((payment) => ({
                          month: format(payment.createdAt, "MMM"),
                          amount: payment.amount,
                        }))
                        .reduce((acc, curr) => {
                          const month = acc.find(
                            (item) => item.month === curr.month
                          );
                          if (month) {
                            month.amount += curr.amount;
                          } else {
                            acc.push(curr);
                          }
                          return acc;
                        }, [] as Array<{ month: string; amount: number }>) ?? []
                    }
                  />
                )}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <Card
              variant="outline"
              className="hover:bg-gray-100 hover:text-card-foreground"
            >
              <CardHeader className="flex flex-row justify-between">
                <CardTitle>Recent Payments</CardTitle>
                <Link to={"/student/payments"} className="p-0">
                  See all
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {myPayments
                    ?.sort((a, b) =>
                      isBefore(b.createdAt, a.createdAt) ? 1 : -1
                    )
                    .filter((payment) => payment.status === "paid")
                    .slice(0, 5)
                    .map((payment) => (
                      <div
                        className="flex justify-between items-center"
                        key={payment.id}
                      >
                        <div>
                          <p className="font-medium">{payment.billName}</p>
                          <p className="text-muted-foreground text-xs">
                            {payment.paymentType} |{" "}
                            {format(payment.createdAt, "dd-MM-yyyy hh:mm a")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-500">
                            {"+" + formatNumber(payment.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            {profile?.financialAidInfo ? (
              <Card
                variant="outline"
                className="hover:bg-gray-100 hover:text-card-foreground hover:cursor-pointer"
                onClick={() => navigate("/student/financial-aid/applications")}
              >
                <CardHeader>
                  <CardTitle>View your Financial Aid Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-row justify-between">
                    <p className="text-muted-foreground">
                      View your financial aid application details
                    </p>
                    <CaretRight className="inline w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Card
                    variant="outline"
                    className="hover:bg-gray-100 hover:text-card-foreground hover:cursor-pointer"
                  >
                    <CardHeader>
                      <CardTitle>Apply for Financial Aid</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-row justify-between">
                        <p className="text-muted-foreground">
                          Begin the application process for financial aid
                        </p>
                        <CaretRight className="inline w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Apply for Financial Aid</DialogTitle>
                    <DialogDescription>
                      Enter the information required to apply for financial aid.
                    </DialogDescription>
                  </DialogHeader>
                  <FinancialAidApplicationForm />
                </DialogContent>
              </Dialog>
            )}
            <Card
              variant="outline"
              className="hover:bg-gray-100 hover:text-card-foreground hover:cursor-pointer"
              onClick={() => navigate("/student/bills")}
            >
              <CardHeader>
                <CardTitle>Make a Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-row justify-between">
                  <p className="text-muted-foreground">
                    Proceed to make a payment for your bills
                  </p>
                  <CaretRight className="inline w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentPage>
  );
};

export default StudentDashboard;
