import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-text-primary">DoneLog</h1>
          <p className="text-sm text-text-secondary">
            Entre para acessar seu espaço de trabalho
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
