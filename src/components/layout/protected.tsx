import { SignInButton } from "@/components/auth/signin-button";
import { auth } from "@/lib/auth";

type ProtectedProps = {
  children: React.ReactNode;
};

export const Protected: React.FC<ProtectedProps> = async ({ children }) => {
  const session = await auth();
  return session ? (
    <>{children}</>
  ) : (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-3xl font-bold">サインインが必要です</h2>
        <p className="text-sm text-gray-500">
          このページにアクセスするにはサインインしてください。
        </p>
        <SignInButton className="mt-2">サインイン</SignInButton>
      </div>
    </div>
  );
};
