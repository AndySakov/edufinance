import { LockClosedIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-muted px-4 sm:px-6 lg:px-8 py-12 min-h-[100dvh]">
      <div className="mx-auto max-w-md text-center">
        <LockClosedIcon className="mx-auto w-12 h-12 text-primary" />
        <h1 className="mt-4 font-bold text-3xl text-foreground sm:text-4xl tracking-tight">
          Unauthorized Access
        </h1>
        <p className="mt-4 text-muted-foreground">
          You do not have permission to access this content. Please contact your
          administrator or try accessing a different area of the application.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center bg-primary hover:bg-primary/90 shadow-sm px-4 py-2 rounded-md font-medium text-primary-foreground text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
