"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { apiErrorMessage } from "@/lib/apiClient";
import { loginSchema, type LoginInput } from "@/lib/validators";
import { Field, Input } from "@/components/ui/FormControls";
import { Button } from "@/components/ui/Button";

function roleHome(role: string) {
  if (role === "admin") return "/admin";
  if (role === "owner") return "/owner";
  return "/dashboard";
}

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setSubmitting(true);
    try {
      const user = await login(values.email, values.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      router.push(searchParams.get("next") || roleHome(user.role));
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not log you in"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-3xl text-ink">Log in</h1>
      <p className="mt-1.5 text-sm text-ink-soft/60">Welcome back to Vroomly.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <Input type="password" autoComplete="current-password" {...register("password")} />
        </Field>
        <Button type="submit" className="w-full" isLoading={submitting}>
          Log in
        </Button>
      </form>

      <div className="mt-6 rounded-md border border-line bg-paper-raised p-3 text-xs text-ink-soft/60">
        <p className="font-medium text-ink-soft">Demo accounts (password: password123)</p>
        <p className="mt-1">admin@vroomly.dev · owner1@vroomly.dev · user1@vroomly.dev</p>
      </div>

      <p className="mt-6 text-center text-sm text-ink-soft/70">
        New to Vroomly?{" "}
        <Link href="/register" className="font-medium text-route-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-14">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
