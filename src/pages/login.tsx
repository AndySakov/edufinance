import { useToast } from "@/components/hooks/use-toast";
import { LoginForm } from "@/components/ui/forms/login";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Login = () => {
  const { state } = useLocation();
  const { toast } = useToast();
  useEffect(() => {
    if (state?.toast) {
      toast(state.toast);
    }
  }, [state?.toast, toast]);
  return (
    <div className="flex justify-center items-center bg-[#0a0e27] w-full min-h-screen">
      <LoginForm />
      <Toaster />
    </div>
  );
};

export default Login;
