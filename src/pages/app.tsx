import { useAuth } from "@/shared/store";
import { Navigate } from "react-router-dom";

const App = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace={true} />;
  } else {
    if (user.role === "student") {
      return <Navigate to="/student/dashboard" replace={true} />;
    } else {
      return <Navigate to="/admin/dashboard" replace={true} />;
    }
  }
};

export default App;
