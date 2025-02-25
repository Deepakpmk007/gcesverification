// utils/withAuth.tsx
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface WithAuthProps {
  children: ReactNode;
  requiredRole: string;
}

const WithAuth = ({ children, requiredRole }: WithAuthProps) => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (!session) {
        // Not authenticated, redirect to login
        router.push("/login");
      } else if (session.user.role !== requiredRole) {
        // Not authorized, redirect to unauthorized page or home
        router.push("/login");
      }
    };

    checkAuth();
  }, [requiredRole, router]);

  // Render the component if authenticated and authorized
  return <>{children}</>;
};

export default WithAuth;
