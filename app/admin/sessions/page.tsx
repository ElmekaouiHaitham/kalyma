"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/app/providers";
import { Calendar, Clock, Video, Plus, X, Users, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Session {
  id: string;
  title: string;
  topic: string;
  description: string;
  scheduled_at: string;
  duration_mins: number;
  max_attendees: number;
  status: string;
  teacher_id: string;
}

export default function AdminSessionsPage() {
  const router = useRouter();
  const { session, isLoading: authLoading, user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    topic: "conversation",
    description: "",
    scheduled_at: "",
    duration_mins: 60,
    max_attendees: 50,
    teacher_id: "", 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      router.push("/auth");
      return;
    }

    if (user?.id && !formData.teacher_id) {
      setFormData(prev => ({ ...prev, teacher_id: user.id }));
    }

    fetchSessions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, authLoading, router, user]);

  const fetchSessions = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions`)
      .then((res) => res.json())
      .then((data) => {
        setSessions(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load sessions.");
      })
      .finally(() => setLoading(false));
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          ...formData,
          scheduled_at: new Date(formData.scheduled_at).toISOString(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to create session");
      }

      setIsModalOpen(false);
      fetchSessions();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Live Sessions</h2>
          <p className="text-gray-400">Manage Daily.co video rooms and scheduled classes.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
        >
          <Plus size={18} />
          Create Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((s) => (
          <div key={s.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                s.status === 'live' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                s.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {s.status}
              </span>
              <span className="text-gray-500 text-xs font-mono">{s.id.slice(0,8)}</span>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-1 truncate">{s.title}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{s.description || 'No description'}</p>

            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-blue-400" />
                <span>{new Date(s.scheduled_at).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-purple-400" />
                <span>{s.duration_mins} mins</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-orange-400" />
                <span>Max: {s.max_attendees || '∞'} attendees</span>
              </div>
            </div>
          </div>
        ))}
        {sessions.length === 0 && (
          <div className="col-span-full p-8 text-center text-gray-400 bg-white/5 rounded-2xl border border-white/10 border-dashed">
            No sessions found. Click &quot;Create Session&quot; to schedule one.
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0f1c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Video className="text-blue-500" /> Schedule Live Session
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateSession} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Session Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Advanced English Conversation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 resize-none h-20"
                    placeholder="What will students learn?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Topic</label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({...formData, topic: e.target.value})}
                      className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="conversation">Conversation</option>
                      <option value="grammar">Grammar</option>
                      <option value="business">Business English</option>
                      <option value="exam_prep">Exam Prep</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date & Time</label>
                    <input
                      required
                      type="datetime-local"
                      value={formData.scheduled_at}
                      onChange={(e) => setFormData({...formData, scheduled_at: e.target.value})}
                      className="w-full bg-[#0a0f1c] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Duration (mins)</label>
                    <input
                      required
                      type="number"
                      min="15"
                      value={formData.duration_mins}
                      onChange={(e) => setFormData({...formData, duration_mins: parseInt(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Max Attendees</label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={formData.max_attendees}
                      onChange={(e) => setFormData({...formData, max_attendees: parseInt(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Teacher ID (UUID)</label>
                  <input
                    required
                    type="text"
                    value={formData.teacher_id}
                    onChange={(e) => setFormData({...formData, teacher_id: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle size={18} /> Provision Daily.co Room
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
