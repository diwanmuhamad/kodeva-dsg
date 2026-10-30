import { redirect } from "next/navigation";
import { Suspense } from "react";

import { LoginForm } from "@/app/admin/login/login-form";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Masuk studio",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="p-8 text-muted">Memuat...</p>}>
      <LoginGate />
    </Suspense>
  );
}

async function LoginGate() {
  const session = await getSession();
  if (session) redirect("/admin");
  return <LoginForm />;
}
