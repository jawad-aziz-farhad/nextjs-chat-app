import { LoginForm } from "@/app/components/LoginForm";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <LoginForm />

        <p className="text-center">
          Don't have an acccount?{" "}
          <Link href={"/auth/signup"} className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
