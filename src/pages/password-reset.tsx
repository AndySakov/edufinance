import { ResetPasswordForm } from "@/components/ui/forms/reset-password";
import { useSearchParams } from "react-router-dom";

const PasswordReset = () => {
  const params = useSearchParams();
  return (
    <div className="flex justify-center bg-[#0a0e27] pt-36 min-h-screen">
      <ResetPasswordForm token={params[0].get("token") ?? undefined} />
    </div>
  );
};

export default PasswordReset;
