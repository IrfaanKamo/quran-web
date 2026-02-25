import React from "react";
import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-600">Get started with interactive memorization</p>
        </div>

        <AuthForm mode="register" />
      </div>
    </div>
  );
}
