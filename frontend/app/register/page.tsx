"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { User as UserIcon, Car } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiErrorMessage } from "@/lib/apiClient";
import { registerSchema, type RegisterInput } from "@/lib/validators";
import { Field, Input } from "@/components/ui/FormControls";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const { register: doRegister } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema), defaultValues: { role: "user" } });

  const role = watch("role");

  async function onSubmit(values: RegisterInput) {
    setSubmitting(true);
    try {
      const user = await doRegister(values);
      toast.success(`Welcome to Vroomly, ${user.name.split(" ")[0]}!`);
      router.push(user.role === "owner" ? "/owner" : "/dashboard");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not create your account"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-14">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-ink">Create an account</h1>
        <p className="mt-1.5 text-sm text-ink-soft/60">Rent a car, or list your own and start earning.</p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setValue("role", "user")}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-md border px-3 py-3 text-sm font-medium transition-colors",
              role === "user" ? "border-ink bg-ink text-white" : "border-line-strong text-ink-soft"
            )}
          >
            <UserIcon className="size-4" /> I want to rent
          </button>
          <button
            type="button"
            onClick={() => setValue("role", "owner")}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-md border px-3 py-3 text-sm font-medium transition-colors",
              role === "owner" ? "border-ink bg-ink text-white" : "border-line-strong text-ink-soft"
            )}
          >
            <Car className="size-4" /> I want to host
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Field label="Full name" error={errors.name?.message}>
            <Input autoComplete="name" {...register("name")} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" autoComplete="email" {...register("email")} />
          </Field>
          <Field label="Phone (optional)" error={errors.phone?.message}>
            <Input type="tel" autoComplete="tel" {...register("phone")} />
          </Field>
          <Field label="Password" error={errors.password?.message}>
            <Input type="password" autoComplete="new-password" {...register("password")} />
          </Field>

          {role === "owner" && (
            <p className="rounded-md bg-caution-500/10 px-3 py-2 text-xs text-[#8a5a12]">
              Host accounts are reviewed by our team before you can list a vehicle — this usually shows up in
              the demo as an admin approval step.
            </p>
          )}

          <Button type="submit" className="w-full" isLoading={submitting}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft/70">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-route-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
