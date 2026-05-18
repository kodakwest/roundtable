import { useEffect, useState } from "react";
import { getAdminKey } from "../lib/api";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminLogin from "../components/admin/AdminLogin";

export default function Admin() {
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    setHasKey(Boolean(getAdminKey()));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {hasKey ? <AdminDashboard onLogout={() => setHasKey(false)} /> : <AdminLogin onLogin={() => setHasKey(true)} />}
    </div>
  );
}
