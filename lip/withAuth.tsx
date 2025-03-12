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
        router.push("/login");
      } else if (session.user.role !== requiredRole) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [requiredRole, router]);

  return <>{children}</>;
};

export default WithAuth;
