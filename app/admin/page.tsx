"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, BookOpen, Activity, DollarSign, MessageSquare, Zap, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { MetricCard } from '@/components/admin/MetricCard';
import { useAuth } from '@/app/providers';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { session, isLoading: authLoading } = useAuth();
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
      .then((dashboardData) => {
        setData(dashboardData);
      })
      .catch((err) => {
        console.error("Admin dashboard error:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [session, authLoading, router]);

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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

  return (
    <AdminLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Core Metrics */}
        <div>
          <h2 className="text-lg font-semibold text-white/90 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-400" /> Platform Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Total Users" 
              value={data.users.total.toLocaleString()} 
              icon={<Users size={24} />}
              description={`${data.users.by_plan.pro} Pro users`}
            />
            <MetricCard 
              title="Total Articles" 
              value={data.content.total_articles.toLocaleString()} 
              icon={<BookOpen size={24} />}
            />
            <MetricCard 
              title="Active Revenue" 
              value={`$${(data.financials.total_revenue_cents / 100).toLocaleString()}`} 
              icon={<DollarSign size={24} />}
              description={`${data.financials.active_subscriptions} active subs`}
            />
            <MetricCard 
              title="Total Engagement" 
              value={data.content.total_opened_articles.toLocaleString()} 
              icon={<Zap size={24} />}
              description="Articles opened"
            />
          </div>
        </div>

        {/* Advanced Retention */}
        <div>
          <h2 className="text-lg font-semibold text-white/90 mb-4 mt-8 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-purple-400" /> User Retention & Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard 
              title="Active Users (30d)" 
              value={data.users.retention.active_last_30_days.toLocaleString()} 
              description={`${data.users.retention.active_last_7_days} active in last 7 days`}
              trend={{ value: 12, isPositive: true }}
            />
            <MetricCard 
              title="Returning Users" 
              value={data.users.retention.returning_users.toLocaleString()} 
              description={`vs ${data.users.retention.one_time_users} one-time users`}
            />
            <MetricCard 
              title="Dormant Users" 
              value={data.users.retention.dormant_users.toLocaleString()} 
              description="Inactive for 30+ days"
              trend={{ value: 5, isPositive: false }}
            />
          </div>
        </div>

        {/* Community & Sessions */}
        <div>
          <h2 className="text-lg font-semibold text-white/90 mb-4 mt-8 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-green-400" /> Community & Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard 
              title="Community Posts" 
              value={data.community.total_posts.toLocaleString()} 
            />
            <MetricCard 
              title="Total Comments" 
              value={data.community.total_comments.toLocaleString()} 
            />
            <MetricCard 
              title="Live Sessions" 
              value={data.content.total_sessions.toLocaleString()} 
            />
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
