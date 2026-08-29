import sys

filepath = r"c:\Users\lenovo\Documents\kalyma\atlasbridge\app\(main)\debate\page.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Find the start of the final return block
start_str = "  return (\n    <main className=\"max-w-7xl mx-auto px-5 md:px-10 pt-20 pb-8 md:py-12 flex flex-col gap-8 md:gap-10 text-[#1a1c1a]\">"
end_str = "    </main>\n  );\n}"

start_idx = content.find(start_str)
end_idx = content.find(end_str) + len(end_str)

if start_idx == -1 or end_idx < len(end_str):
    print("Could not find the target block.")
    sys.exit(1)

new_return_block = """  return (
    <main className="max-w-3xl mx-auto px-5 md:px-10 pt-20 pb-8 md:py-12 flex flex-col gap-6 text-[#1a1c1a] min-h-[80vh] justify-center">
      <div className="bg-[#ffffff] border-[1.5px] border-[#021541] rounded-2xl p-8 md:p-12 shadow-[0_4px_12px_rgba(2,21,65,0.08)] flex flex-col items-center text-center">
        <div className="bg-[#e3e2e0] text-[#021541] p-4 rounded-full mb-6 border-[1.5px] border-[#021541]">
          <CheckCircle2 className="w-12 h-12 text-[#4ade80]" />
        </div>
        <h1 className="text-[28px] md:text-[32px] font-extrabold text-[#021541] tracking-tight mb-4">
          Booking Confirmed!
        </h1>
        <p className="text-[16px] text-[#45464f] mb-8 max-w-lg">
          Your debate session is locked in. Get ready to debate!
        </p>
        
        {matches.length > 0 && (
          <div className="bg-[#f4f3f1] border border-[#c5c6d0] rounded-xl p-5 w-full max-w-md text-left">
            <h3 className="font-bold text-[#021541] text-lg mb-3 border-b border-[#c5c6d0] pb-2">Upcoming Session</h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-[#757680] font-medium">Time:</span>
                <span className="font-semibold text-[#1a1c1a]">
                  {new Date(matches[0].start_time).toLocaleString([], {
                    weekday: 'short', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[#757680] font-medium">Opponent:</span>
                <span className="font-semibold text-[#1a1c1a]">
                  {matches[0].opponent?.full_name || "Waiting for opponent..."}
                </span>
              </div>
            </div>
            
            <Link href={matches[0].room_url || "#"} className="block w-full mt-6">
              <button className="cursor-pointer w-full bg-[#021541] text-[#ffffff] font-semibold text-[14px] py-2.5 md:py-3 rounded-xl shadow-[0_4px_12px_rgba(2,21,65,0.08)] hover:bg-[#1a2b56] transition-all disabled:opacity-70 disabled:hover:bg-[#021541]" disabled={!matches[0].room_url}>
                {matches[0].room_url ? "Join Room" : "Link will be available soon"}
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}"""

new_content = content[:start_idx] + new_return_block + content[end_idx:]

with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Replaced successfully.")
