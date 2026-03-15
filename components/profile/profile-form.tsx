"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { updateUser } from "@/services/users";
import { User, KeyRound, CheckCircle2 } from "lucide-react";

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required." }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters." }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must differ from current password.",
    path: ["newPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ProfileForm() {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError: setFieldError,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: PasswordFormValues) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUser(user._id, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setSuccess("Password updated successfully.");
      reset();
    } catch (err: any) {
      // Server-side field errors (e.g., wrong current password)
      if (err && typeof err === "object" && "field" in err && "message" in err) {
        setFieldError(err.field as keyof PasswordFormValues, {
          type: "server",
          message: err.message,
        });
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          You must be signed in to view your profile.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your current account details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Username
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Email
              </p>
              <p className="text-sm font-semibold text-gray-900">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Enter your current password to set a new one
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Global error */}
            {error && (
              <div
                role="alert"
                className="rounded-md bg-red-50 border border-red-100 px-4 py-3 text-red-700 text-sm"
              >
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div
                role="status"
                className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-green-700 text-sm"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {success}
              </div>
            )}

            {/* Current Password */}
            <div className="space-y-1">
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                {...register("currentPassword")}
                aria-invalid={!!errors.currentPassword}
                aria-describedby={
                  errors.currentPassword ? "currentPassword-error" : undefined
                }
                className={cn(
                  "w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-slate-400",
                  errors.currentPassword && "border-red-400 focus:ring-red-400"
                )}
                placeholder="••••••••"
              />
              {errors.currentPassword && (
                <p id="currentPassword-error" className="text-xs text-red-600 mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="border-t" />

            {/* New Password */}
            <div className="space-y-1">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                {...register("newPassword")}
                aria-invalid={!!errors.newPassword}
                aria-describedby={errors.newPassword ? "newPassword-error" : undefined}
                className={cn(
                  "w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-slate-400",
                  errors.newPassword && "border-red-400 focus:ring-red-400"
                )}
                placeholder="••••••••"
              />
              {errors.newPassword && (
                <p id="newPassword-error" className="text-xs text-red-600 mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label
                htmlFor="confirmNewPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                {...register("confirmNewPassword")}
                aria-invalid={!!errors.confirmNewPassword}
                aria-describedby={
                  errors.confirmNewPassword ? "confirmNewPassword-error" : undefined
                }
                className={cn(
                  "w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-slate-400",
                  errors.confirmNewPassword && "border-red-400 focus:ring-red-400"
                )}
                placeholder="••••••••"
              />
              {errors.confirmNewPassword && (
                <p id="confirmNewPassword-error" className="text-xs text-red-600 mt-1">
                  {errors.confirmNewPassword.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Spinner className="mr-2" />
                    Updating…
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
