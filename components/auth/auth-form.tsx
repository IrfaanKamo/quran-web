"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useAsyncClick } from "@/hooks/useAsyncClick";
import { login as apiLogin, register as apiRegister } from "@/services/auth";
import { useAuthActions } from "@/hooks/useAuthActions";

const loginSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username may only contain letters, numbers and underscores.",
    }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters." })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username may only contain letters, numbers and underscores.",
      }),
    email: z.email({ message: "Please enter a valid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { handleRegister, handleLogin, isLoading, error: authError } = useAuthActions();

  interface FormValues {
    username: string;
    email?: string;
    password: string;
    confirmPassword?: string;
  }

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(mode === "login" ? loginSchema : registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      ...(mode === "register" ? { confirmPassword: "" } : {}),
    },
  });

  const submit = async (values: FormValues) => {
    setError(null);
    setSuccess(null);
    
    if (mode === "register") {
      try {
        await handleRegister(values.username, values.email!, values.password);
        setSuccess("Account created. Redirecting…");
        router.push("/");
        return;
      } catch (err: any) {
        // server-side field error
        if (err && typeof err === "object" && "field" in err && "message" in err) {
          setFieldError((err as any).field, {
            type: "server",
            message: (err as any).message,
          });
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(authError);
        }
        return;
      }
    }

    try {
      await handleLogin(values.username, values.password);
      setSuccess("Logged in. Redirecting…");
      router.push("/");
      return;
    } catch (err: any) {
      if (err && typeof err === "object" && "field" in err && "message" in err) {
        setFieldError((err as any).field, {
          type: "server",
          message: (err as any).message,
        });
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(authError);
      }
      return;
    }
  };

  const { handleClick, loading } = useAsyncClick(submit);

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "login" ? "Sign in to your account" : "Create an account"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit((data) => handleClick(data))}
          className="space-y-4"
          noValidate
        >
          {error && (
            <div
              role="alert"
              className="rounded-md bg-red-50 border border-red-100 p-3 text-red-700 text-sm"
            >
              {error}
            </div>
          )}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username")}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : undefined}
              className={cn(
                "w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400",
                "placeholder:text-slate-400",
              )}
              placeholder="your-username"
            />
            {errors.username && (
              <div id="username-error" className="text-sm text-red-600 mt-1">
                {errors.username?.message}
              </div>
            )}
          </div>

          {mode === "register" && (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={cn(
                  "w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400",
                  "placeholder:text-slate-400",
                )}
                placeholder="you@example.com"
              />
              {errors.email && (
                <div id="email-error" className="text-sm text-red-600 mt-1">
                  {errors.email?.message}
                </div>
              )}
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={cn(
                "w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400",
                "placeholder:text-slate-400",
              )}
              placeholder="••••••••"
            />
            {errors.password && (
              <div id="password-error" className="text-sm text-red-600 mt-1">
                {errors.password?.message}
              </div>
            )}
          </div>

          {mode === "register" && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? "confirmPassword-error" : undefined
                }
                className={cn(
                  "w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400",
                  "placeholder:text-slate-400",
                )}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <div id="confirmPassword-error" className="text-sm text-red-600 mt-1">
                  {errors.confirmPassword?.message}
                </div>
              )}
            </div>
          )}

          {success && <div className="text-sm text-green-600">{success}</div>}

          <div className="flex items-center justify-between gap-4">
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? <Spinner /> : mode === "login" ? "Sign In" : "Create Account"}
            </Button>

            <Link
              href={mode === "login" ? "/auth/register" : "/auth/login"}
              className="text-sm text-green-700 hover:underline"
            >
              {mode === "login" ? "Create account" : "Have an account? Sign in"}
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
