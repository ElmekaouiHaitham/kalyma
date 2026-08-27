"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";

export default function RecordingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${id}/recording-link`);
        if (res.status === 409) {
           setError("Recording is still processing on our servers. Please check back in a few minutes.");
           return;
        }
        if (!res.ok) throw new Error("Could not fetch recording");
        const data = await res.json();
        setUrl(data.url);
      } catch (err: any) {
        setError(err.message || "Recording not available.");
      }
    };
    fetchLink();
  }, [id]);

  const isYouTube = url ? (url.includes("youtube.com") || url.includes("youtu.be")) : false;
  
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  const ytId = isYouTube && url ? getYouTubeId(url) : null;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen bg-[#f7f2ea]">
      <header className="h-16 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 px-4 flex items-center gap-4 shrink-0">
        <button onClick={() => router.back()} className="p-2 hover:bg-[#f7f2ea] rounded-lg transition-colors text-[#1a2b5e]">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-sm font-bold text-[#1a2b5e]">Session Recording</h1>
      </header>
      <main className="flex-1 bg-black flex items-center justify-center p-4 md:p-8">
        {error ? (
          <div className="text-white text-center max-w-md bg-white/10 p-8 rounded-3xl backdrop-blur-xl border border-white/20">
             <p className="mb-6 font-semibold">{error}</p>
             <button onClick={() => router.back()} className="w-full px-4 py-3 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-colors">Go Back</button>
          </div>
        ) : !url ? (
          <div className="flex flex-col items-center justify-center text-white">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#c9a84c]" />
            <p className="font-semibold text-slate-300">Loading secure video player...</p>
          </div>
        ) : isYouTube && ytId ? (
          <iframe 
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
            className="w-full h-full max-h-[85vh] rounded-2xl shadow-2xl bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video 
            src={url} 
            controls 
            preload="metadata"
            playsInline
            className="w-full h-full max-h-[85vh] rounded-2xl shadow-2xl object-contain bg-black"
          />
        )}
      </main>
    </div>
  );
}
