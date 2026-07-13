import { supabase } from "./supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function fetchAdminDashboardData() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_URL}/admin/dashboard`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Access denied: You are not an admin");
    }
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
}
