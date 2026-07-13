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
  }, [session, authLoading, router]);

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-2">Access Error</h2>
          <p>{error}</p>
        </div>
      </AdminLayout>
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
        <Section icon={<Users size={20} />} title="Users Overview" color="text-blue-400">
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
        <Section icon={<Clock size={20} />} title="User Retention" color="text-purple-400">
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
        <Section icon={<Flame size={20} />} title="Streaks, XP & Achievements" color="text-orange-400">
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
        <Section icon={<Brain size={20} />} title="Atlas AI Usage" color="text-cyan-400">
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
        <Section icon={<BookOpen size={20} />} title="Spaced Repetition" color="text-emerald-400">
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
        <Section icon={<DollarSign size={20} />} title="Revenue & Subscriptions" color="text-yellow-400">
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
      <h2 className={`text-lg font-semibold text-white/90 mb-4 flex items-center`}>
        <span className={color}>{icon}</span>
        <span className="ml-2">{title}</span>
      </h2>
      {children}
    </div>
  );
}
