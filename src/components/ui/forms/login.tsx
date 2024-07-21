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
import { useAuth } from "@/shared/store";
import { ResponseWithOptionalData, data } from "@/shared/types/data";
import { AuthenticatedUser } from "@/shared/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Logo from "../logo";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/hooks/use-toast";
import { Toaster } from "../toaster";

const formSchema = z.object({
  email: z.string().email({
    message: "Email must be a valid email",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const axios = useClient();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    shouldFocusError: true,
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    axios
      .post<ResponseWithOptionalData<AuthenticatedUser>>("/auth/login", values)
      .then((res) => {
        const user = data(res.data);
        if (user) {
          login(user);
          if (user.role === "student") {
            navigate("/student/dashboard", {
              state: {
                toast: {
                  title: "Welcome back!",
                  description: "You have successfully logged in.",
                },
              },
            });
          } else {
            navigate("/admin/dashboard", {
              state: {
                toast: {
                  title: "Welcome back!",
                  description: "You have successfully logged in.",
                },
              },
            });
          }
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

  return (
    <div className="bg-white shadow-md p-8 rounded-lg w-full max-w-md">
      <Logo variant="dark" />
      <h2 className="mt-4 font-semibold text-black text-xl">
        Sign in with your email
      </h2>
      <p className="mt-1 text-gray-500 text-sm">
        Use your email to sign in to the finance portal
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block font-medium text-gray-700 text-sm">
                  Email Address
                </FormLabel>
                <FormControl {...field}>
                  <input
                    {...field}
                    type="email"
                    id="email"
                    className="block border-gray-300 focus:border-indigo-500 shadow-sm mt-1 px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block font-medium text-gray-700 text-sm">
                  Password
                </FormLabel>
                <FormControl {...field}>
                  <div className="relative mt-1">
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      className="block border-gray-300 focus:border-indigo-500 shadow-sm px-3 py-2 border rounded-sm w-full focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter Password"
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
            Sign in
          </Button>
        </form>
      </Form>
      <Toaster />
    </div>
  );
}
