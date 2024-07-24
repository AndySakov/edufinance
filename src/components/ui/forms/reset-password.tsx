import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useClient } from "@/shared/axios";
import { ResponseWithNoData } from "@/shared/types/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Logo from "../logo";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/hooks/use-toast";
import { Toaster } from "../toaster";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../spinner";
import ServerError from "@/pages/utility/server-error";

const formSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export function ResetPasswordForm({ token }: { token: string | undefined }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const axios = useClient();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    shouldFocusError: true,
    mode: "onSubmit",
    defaultValues: {
      password: "",
    },
  });

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["reset-token-validate"],
    queryFn: async () => {
      const { data } = await axios.get<ResponseWithNoData>(
        "/auth/password/reset/request/callback",
        { params: { token } }
      );
      return data;
    },
  });

  if (!token) {
    return <ServerError errorMessage="Invalid password reset token" />;
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    axios
      .post<ResponseWithNoData>(
        "/auth/password/reset",
        {
          newPassword: values.password,
        },
        {
          params: { token },
        }
      )
      .then((res) => {
        if (res.data.success) {
          navigate("/login", {
            state: {
              toast: {
                title: "Password reset successfully",
                description: "You can now log in with your new password.",
              },
            },
          });
        } else {
          toast({
            title: "Error",
            description: res.data.message,
            variant: "destructive",
          });
        }
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      });
  };

  if (isLoading) {
    return <Spinner />;
  } else if (isError) {
    console.log(error);
    return <ServerError errorMessage={error?.message} />;
  } else {
    if (data?.success) {
      return (
        <div className="bg-white shadow-md p-8 rounded-lg w-full max-w-md h-fit">
          <Logo variant="dark" />
          <h2 className="mt-4 font-semibold text-black text-xl">
            Reset your account password
          </h2>
          <p className="mt-1 text-gray-500 text-sm">Enter your new password</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-6"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block font-medium text-gray-700 text-sm">
                      New Password
                    </FormLabel>
                    <FormControl {...field}>
                      <div className="relative mt-1">
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          id="password"
                          className="block border-gray-300 focus:border-indigo-500 shadow-sm px-3 py-2 border rounded-sm focus:ring-indigo-500 w-full sm:text-sm"
                          placeholder="Enter New Password"
                        />
                        <span
                          className="right-0 absolute inset-y-0 flex items-center pr-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOpenIcon className="w-5 h-5 text-gray-400" />
                          ) : (
                            <EyeClosedIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="bg-black mt-4 py-3 rounded-md w-full text-white"
                size="lg"
              >
                Reset Password
              </Button>
            </form>
          </Form>
          <Toaster />
        </div>
      );
    } else {
      return <ServerError errorMessage="Password reset token is invalid" />;
    }
  }
}
