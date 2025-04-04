import { LoginForm } from '@/components/login-form';

export default function Login() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-lg">
        <LoginForm />
      </div>
    </div>
  );
}
