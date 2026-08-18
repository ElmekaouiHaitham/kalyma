"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Activity,
  DollarSign,
  Zap,
  Clock,
  TrendingUp,
  Brain,
  MessageSquare,
  Flame,
  Trophy,
  CreditCard,
  BookOpen,
  Target,
  Gavel,
} from "lucide-react";
import { motion } from "framer-motion";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { MetricCard } from "@/components/admin/MetricCard";
import { useAuth } from "@/app/providers";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { session, isLoading: authLoading } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Debate pool state
  const [debatePool, setDebatePool] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [leagueName, setLeagueName] = useState("League 1");
  const [launching, setLaunching] = useState(false);
  
  // User Management state
  const [usersList, setUsersList] = useState<any[]>([]);
  const [updatingPlanId, setUpdatingPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      router.push("/auth");
      return;
    }

    const headers = { Authorization: `Bearer ${session.access_token}` };

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, { headers })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 403) {
            throw new Error("You do not have administrator privileges.");
          }
          const text = await res.text();
          throw new Error(text || `Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((dashboardData) => setData(dashboardData))
      .catch((err) => {
        console.error("Admin dashboard error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/debate/pool`, { headers })
      .then(res => res.json())
      .then(d => {
        if (d.pool) {
          setDebatePool(d.pool);
          // auto-select all initially, or leave empty. Let's leave empty so admin explicitly selects
        }
      })
      .catch(console.error);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, { headers })
      .then(res => res.json())
      .then(d => {
        if (d.users) setUsersList(d.users);
      })
      .catch(console.error);

  }, [session, authLoading, router]);

  const handleUpdatePlan = async (userId: string, newPlan: string) => {
    if (!session) return;
    setUpdatingPlanId(userId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/plan`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ plan: newPlan })
      });
      if (!res.ok) throw new Error("Failed to update plan");
      
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, plan: newPlan } : u));
    } catch (err) {
      alert("Failed to update plan");
    } finally {
      setUpdatingPlanId(null);
    }
  };

  const handleLaunchMatching = async () => {
    if (selectedUsers.length < 2) {
      alert("Please select at least 2 users.");
      return;
    }
    if (!leagueName.trim()) {
      alert("Please enter a league name.");
      return;
    }
    if (!session) return;

    setLaunching(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/debate/launch-matching`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          league_name: leagueName,
          selected_user_ids: selectedUsers
        })
      });
      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.error || "Failed to launch matching");
      }
      alert("League successfully launched!");
      // Reset selected users and pool
      setSelectedUsers([]);
      setDebatePool(debatePool.filter(u => !selectedUsers.includes(u.user_id)));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLaunching(false);
    }
  };

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9842f]" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f2ea] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(26,43,94,0.12)] text-center border border-[#1a2b5e]/5">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-3xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1a2b5e] mb-3">Unauthorized</h2>
          <p className="text-[#4a5568] leading-relaxed mb-8">
            {error || "You do not have administrator privileges to view this page."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-4 bg-[#1a2b5e] text-white rounded-xl font-bold shadow-lg shadow-[#1a2b5e]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const revenueDollars = (cents: number) =>
    `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        {/* ─── USERS OVERVIEW ─────────────────────────────────── */}
        <Section icon={<Users size={20} />} title="Users Overview" color="text-[#c9842f]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard
              title="Total Users"
              value={data.users.total.toLocaleString()}
              icon={<Users size={22} />}
              description={`${data.users.by_plan.pro} Pro · ${data.users.by_plan.free} Free`}
            />
            <MetricCard
              title="New Today"
              value={data.users.growth.new_today.toLocaleString()}
              icon={<TrendingUp size={22} />}
              description="Signed up today"
            />
            <MetricCard
              title="New This Week"
              value={data.users.growth.new_last_7_days.toLocaleString()}
              icon={<TrendingUp size={22} />}
              description="Last 7 days"
            />
            <MetricCard
              title="New This Month"
              value={data.users.growth.new_last_30_days.toLocaleString()}
              icon={<TrendingUp size={22} />}
              description="Last 30 days"
            />
          </div>
        </Section>

        {/* ─── RETENTION ─────────────────────────────────────── */}
        <Section icon={<Clock size={20} />} title="User Retention" color="text-[#c9842f]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard
              title="Active (7d)"
              value={data.users.retention.active_last_7_days.toLocaleString()}
              icon={<Activity size={22} />}
              description="Active in last 7 days"
            />
            <MetricCard
              title="Active (30d)"
              value={data.users.retention.active_last_30_days.toLocaleString()}
              icon={<Activity size={22} />}
              description="Active in last 30 days"
            />
            <MetricCard
              title="Returning Users"
              value={data.users.retention.returning_users.toLocaleString()}
              icon={<Users size={22} />}
              description="Came back after signup day"
            />
            <MetricCard
              title="Dormant / Never Returned"
              value={`${data.users.retention.dormant_users.toLocaleString()} / ${data.users.retention.never_returned.toLocaleString()}`}
              icon={<Clock size={22} />}
              description="Inactive 30d+ / One-visit"
            />
          </div>
        </Section>

        {/* ─── STREAKS & XP ──────────────────────────────────── */}
        <Section icon={<Flame size={20} />} title="Streaks, XP & Achievements" color="text-[#c9842f]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard
              title="Active Streaks"
              value={data.engagement.streaks.users_with_active_streak.toLocaleString()}
              icon={<Flame size={22} />}
              description={`Longest: ${data.engagement.streaks.longest_streak} days`}
            />
            <MetricCard
              title="Avg Streak"
              value={data.engagement.streaks.avg_streak_length}
              icon={<Target size={22} />}
              description="Days (among active)"
            />
            <MetricCard
              title="Total XP Awarded"
              value={data.engagement.xp.total_xp_awarded.toLocaleString()}
              icon={<Zap size={22} />}
              description={`${data.engagement.xp.xp_events_today} events today`}
            />
            <MetricCard
              title="XP Per User (avg)"
              value={data.engagement.xp.avg_xp_per_user.toLocaleString()}
              icon={<Zap size={22} />}
              description={`Top: ${data.engagement.xp.highest_xp.toLocaleString()} XP`}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
            <MetricCard
              title="Achievements Earned"
              value={data.engagement.achievements.total_earned.toLocaleString()}
              icon={<Trophy size={22} />}
              description={`By ${data.engagement.achievements.users_with_achievements} users`}
            />
          </div>
        </Section>

        {/* ─── AI / ATLAS ────────────────────────────────────── */}
        <Section icon={<Brain size={20} />} title="Atlas AI Usage" color="text-[#c9842f]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard
              title="AI Conversations"
              value={data.ai.total_conversations.toLocaleString()}
              icon={<MessageSquare size={22} />}
              description={`${data.ai.unique_users} unique users`}
            />
            <MetricCard
              title="AI Messages"
              value={data.ai.total_messages.toLocaleString()}
              icon={<MessageSquare size={22} />}
            />
            <MetricCard
              title="Tokens Used"
              value={data.ai.total_tokens_used.toLocaleString()}
              icon={<Brain size={22} />}
            />
            <MetricCard
              title="Avg Messages / Conv"
              value={
                data.ai.total_conversations > 0
                  ? (data.ai.total_messages / data.ai.total_conversations).toFixed(1)
                  : "0"
              }
              icon={<Activity size={22} />}
            />
          </div>
        </Section>

        {/* ─── SPACED REPETITION ─────────────────────────────── */}
        <Section icon={<BookOpen size={20} />} title="Spaced Repetition" color="text-[#c9842f]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard
              title="Saved Items"
              value={data.spaced_repetition.total_saved_items.toLocaleString()}
              icon={<BookOpen size={22} />}
              description={`By ${data.spaced_repetition.users_using_review} users`}
            />
            <MetricCard
              title="Review Cards"
              value={data.spaced_repetition.total_review_cards.toLocaleString()}
              icon={<Target size={22} />}
              description={`${data.spaced_repetition.cards_due_now} due now`}
            />
            <MetricCard
              title="Avg Ease Factor"
              value={data.spaced_repetition.avg_ease_factor}
              icon={<Activity size={22} />}
              description="SM-2 ease (2.5 = default)"
            />
          </div>
        </Section>

        {/* ─── FINANCIALS ────────────────────────────────────── */}
        <Section icon={<DollarSign size={20} />} title="Revenue & Subscriptions" color="text-[#c9842f]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard
              title="Total Revenue"
              value={revenueDollars(data.financials.total_revenue_cents)}
              icon={<DollarSign size={22} />}
              description={`${data.financials.successful_payments} successful payments`}
            />
            <MetricCard
              title="Revenue This Month"
              value={revenueDollars(data.financials.revenue_this_month_cents)}
              icon={<TrendingUp size={22} />}
            />
            <MetricCard
              title="Failed Payments"
              value={data.financials.failed_payments.toLocaleString()}
              icon={<CreditCard size={22} />}
              description={`of ${data.financials.total_payments} total`}
            />
            <MetricCard
              title="Subscriptions"
              value={data.financials.subscriptions.active.toLocaleString()}
              icon={<CreditCard size={22} />}
              description={`${data.financials.subscriptions.trialing} trialing · ${data.financials.subscriptions.cancelled} cancelled`}
            />
          </div>
        </Section>

        {/* ─── DEBATE LEAGUE CONTROL PANEL ────────────────────── */}
        <Section icon={<Gavel size={20} />} title="Debate League Control Panel" color="text-[#c9842f]">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_12px_rgba(2,21,65,0.08)] border border-[#1a2b5e]/10">
            <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
              
              <div className="flex-1 space-y-4">
                <h3 className="text-xl font-bold text-[#1a2b5e]">Manage Active Pool</h3>
                <p className="text-[#4a5568]">
                  Currently, there are <strong className="text-[#c9842f] text-lg">{debatePool.length}</strong> students waiting in the pool for the next league assignment.
                </p>
                <div className="bg-[#f7f2ea] p-4 rounded-xl border border-[#c9842f]/30 inline-block mb-4">
                  <span className="font-semibold text-[#1a2b5e] flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#c9842f]" /> {debatePool.length} Users Ready
                  </span>
                </div>
                
                <div className="max-h-60 overflow-y-auto border border-[#e2e8f0] rounded-lg p-3 bg-[#f8f9fa] flex flex-col gap-2">
                  <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-[#e2e8f0]">
                    <span className="text-xs font-semibold text-[#718096] uppercase tracking-wider">Select Participants</span>
                    <button 
                      onClick={() => setSelectedUsers(debatePool.map(u => u.user_id))}
                      className="text-xs font-medium text-[#c9842f] hover:underline"
                    >
                      Select All
                    </button>
                  </div>
                  {debatePool.length === 0 ? (
                    <p className="text-sm text-[#4a5568] p-2">No users in the pool.</p>
                  ) : (
                    debatePool.map(user => (
                      <label key={user.user_id} className="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded-md transition-colors border border-transparent hover:border-[#e2e8f0]">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 accent-[#1a2b5e] rounded"
                          checked={selectedUsers.includes(user.user_id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedUsers([...selectedUsers, user.user_id]);
                            else setSelectedUsers(selectedUsers.filter(id => id !== user.user_id));
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm text-[#1a2b5e] font-medium">{user.full_name || user.email || "Unknown User"}</span>
                          {user.availability && (
                            <span className="text-xs text-[#718096]">
                              Available: {Object.keys(user.availability).filter(k => user.availability[k]?.length).join(', ') || "No times"}
                            </span>
                          )}
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex-1 w-full bg-[#f8f9fa] rounded-xl p-5 border border-[#e2e8f0] sticky top-10">
                <h4 className="font-semibold text-[#1a2b5e] mb-3">Launch New League</h4>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4a5568] mb-1">League Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. League 1" 
                      value={leagueName}
                      onChange={(e) => setLeagueName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#c9842f]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4a5568] mb-1">Number of Students Selected</label>
                    <div className="w-full px-4 py-2 rounded-lg border border-[#cbd5e1] bg-white text-[#1a2b5e] font-medium">
                      {selectedUsers.length} Students
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={handleLaunchMatching}
                      disabled={launching || selectedUsers.length < 2}
                      className="flex-1 bg-[#1a2b5e] text-white font-semibold py-3 rounded-lg hover:bg-[#253d82] shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {launching ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Launch Matching"
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </Section>

        {/* ─── USER MANAGEMENT CONTROL PANEL ────────────────────── */}
        <Section icon={<Users size={20} />} title="User Management" color="text-[#c9842f]">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_12px_rgba(2,21,65,0.08)] border border-[#1a2b5e]/10">
            <h3 className="text-xl font-bold text-[#1a2b5e] mb-4">All Users</h3>
            <div className="overflow-x-auto border border-[#e2e8f0] rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f8f9fa] border-b border-[#e2e8f0]">
                  <tr>
                    <th className="p-3 text-sm font-semibold text-[#4a5568]">Name</th>
                    <th className="p-3 text-sm font-semibold text-[#4a5568]">Email</th>
                    <th className="p-3 text-sm font-semibold text-[#4a5568]">Joined</th>
                    <th className="p-3 text-sm font-semibold text-[#4a5568]">Plan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {usersList.map((user) => (
                    <tr key={user.id} className="hover:bg-[#f8f9fa] transition-colors">
                      <td className="p-3 text-sm text-[#1a2b5e] font-medium">{user.full_name || "Unknown"}</td>
                      <td className="p-3 text-sm text-[#4a5568]">{user.email}</td>
                      <td className="p-3 text-sm text-[#718096]">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <select
                          value={user.plan}
                          disabled={updatingPlanId === user.id}
                          onChange={(e) => handleUpdatePlan(user.id, e.target.value)}
                          className={`text-sm px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#c9842f] ${
                            user.plan === "pro" 
                              ? "bg-amber-50 border-[#c9842f]/30 text-[#c9842f] font-semibold" 
                              : "bg-gray-50 border-[#cbd5e1] text-[#4a5568]"
                          }`}
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                        </select>
                        {updatingPlanId === user.id && (
                          <span className="ml-2 inline-block w-4 h-4 border-2 border-[#c9842f]/30 border-t-[#c9842f] rounded-full animate-spin" />
                        )}
                      </td>
                    </tr>
                  ))}
                  {usersList.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-[#718096]">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Section>
      </motion.div>
    </AdminLayout>
  );
}

/* ── tiny helper for consistent section headers ────────────────────────── */
function Section({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className={`text-lg font-semibold text-[#1a2b5e] mb-4 flex items-center`}>
        <span className={color}>{icon}</span>
        <span className="ml-2">{title}</span>
      </h2>
      {children}
    </div>
  );
}
