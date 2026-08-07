"use client";

import Image from "next/image";
import { 
  Trophy, 
  User, 
  CalendarDays, 
  Gavel, 
  History, 
  Star, 
  ArrowRight 
} from "lucide-react";

export default function DebatePage() {
  return (
    <main className="max-w-7xl mx-auto px-5 md:px-10 pt-20 pb-8 md:py-12 flex flex-col gap-8 md:gap-10 text-[#1a1c1a]">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between bg-[#f4f3f1] p-6 md:p-8 rounded-2xl border-[1.5px] border-[#021541] shadow-[0_4px_12px_rgba(2,21,65,0.08)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center md:items-start w-full">
          {/* Mobile Badge */}
          <div className="md:hidden relative w-24 h-24 mb-4">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAR_Zn7015lSkXchb5kQS0In5OpXfSCU-riqSBISts-KBfXvLAXCoIdEDeFBQlse1_P5Lxf57N5xy22ft-oeoaYX0MCXPU7YU8TrNC5ymm7GHbGNkeequYsTrE0Xp34zMOFckwtb2KUhR78cc71c_jPz080ZN4OEV-JCGxa5PDmxoEVFCoZNfeIvuEAoKhDePrYaskk3AiznecTYIHJGVVlWYW1O3CWd1aREmIbbDYbNEJ0V1g9k8o7"
              alt="Badge"
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-1 md:mb-2 text-center md:text-left">
            {/* Desktop Trophy Icon */}
            <div className="hidden md:flex bg-[#fed65b] text-[#745c00] p-3 rounded-full items-center justify-center border-2 border-[#735c00]">
              <Trophy className="w-8 h-8 fill-current" />
            </div>
            <h1 className="text-[28px] md:text-[32px] leading-[34px] md:leading-[40px] font-extrabold text-[#021541] tracking-tight">
              Debate League
            </h1>
          </div>
          <p className="text-[14px] md:text-[16px] leading-[20px] md:leading-[24px] text-[#45464f] md:ml-[72px]">
            Season 4 • Gold Tier • 12 Days Remaining
          </p>
        </div>
        {/* Decorative element (Desktop) */}
        <div className="hidden md:block absolute right-0 top-0 opacity-10 pointer-events-none translate-x-4 -translate-y-4">
          <Trophy className="w-48 h-48 fill-current text-[#021541]" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column: Leaderboard */}
        <div className="lg:col-span-2 flex flex-col gap-5 md:gap-6">
          <section className="md:bg-[#ffffff] md:rounded-2xl md:border-[1.5px] md:border-[#021541] md:overflow-hidden md:shadow-[0_4px_12px_rgba(2,21,65,0.08)]">
            
            {/* Desktop Header */}
            <div className="hidden md:flex bg-[#021541] text-[#ffffff] p-5 border-b-[1.5px] border-[#021541] justify-between items-center">
              <h2 className="font-bold text-[24px] leading-[32px]">La Liga Rankings</h2>
              <span className="font-semibold text-[14px] bg-white/20 px-3 py-1 rounded-full">Top 3 Promote</span>
            </div>
            
            {/* Mobile Header */}
            <h2 className="md:hidden font-bold text-[24px] leading-[32px] text-[#021541] flex items-center gap-2 mb-2">
              <Trophy className="w-6 h-6" /> Top Debaters
            </h2>

            <div className="overflow-x-auto bg-[#ffffff] p-4 md:p-0 rounded-xl md:rounded-none border-[1.5px] border-[#021541] md:border-none shadow-[2px_4px_0px_rgba(2,21,65,0.1)] md:shadow-none">
              <table className="w-full text-left border-collapse">
                <thead className="hidden md:table-header-group">
                  <tr className="bg-[#f4f3f1] border-b-[1.5px] border-[#c5c6d0] font-semibold text-[14px] text-[#45464f]">
                    <th className="p-4 text-center w-16">Rank</th>
                    <th className="p-4">Debater</th>
                    <th className="p-4 text-center">Points</th>
                    <th className="p-4 text-center">Form</th>
                  </tr>
                </thead>
                <tbody className="font-normal text-[16px] text-[#1a1c1a] flex flex-col md:table-row-group gap-2 md:gap-0">
                  
                  {/* Row 1 */}
                  <tr className="flex md:table-row justify-between items-center bg-[#fed65b]/20 md:border-b-[1.5px] md:border-[#c5c6d0]/50 hover:bg-[#f4f3f1] transition-colors p-2 md:p-0 rounded-lg md:rounded-none">
                    <td className="p-2 md:p-4 text-center font-bold text-[#735c00] md:w-16 flex items-center md:table-cell">
                      <span className="w-4 text-center inline-block">1</span>
                    </td>
                    <td className="p-2 md:p-4 flex items-center gap-3 flex-1 md:flex-none">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdcrcHJHf9SbPL8uCMnwQvGgmilpFFm7tnCGYPlS0UW2hi-GoZ4HJSucrifTZr6gOG3VmJ8O5YIL2mZMkvRlqFL76kqPfUXIX3nskn2hk5PTLz3e1bd2FhptAl0UcuYwyBY5ei_FEvlv8UX4sQ7u87JvFe5bXjBi4ZqsTrRjrNZnV_iV8JbJh4g8m02jb0fEH6vqi6-Z0A0e-MDN-4MwCojFtRfatyegLdaHuWdE5PJbhPNNcvppiB" 
                        alt="Alex Chen" 
                        className="w-10 h-10 md:w-8 md:h-8 rounded-full border border-[#021541] object-cover" 
                      />
                      <div className="flex flex-col md:block">
                        <span className="font-bold text-[#021541] md:text-[#1a1c1a] text-[14px] md:text-[16px]">Alex Chen</span>
                        <span className="md:hidden text-[12px] text-[#45464f]">1240 pts</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell p-4 text-center font-bold">1,240</td>
                    <td className="p-2 md:p-4 md:table-cell flex items-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#c5c6d0] md:bg-[#f87171] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">L</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2 (Current User in Desktop is 3, Mobile is 2. Let's make it 2 for both) */}
                  <tr className="flex md:table-row justify-between items-center bg-[#1a2b56]/10 md:bg-[#021541]/5 md:border-b-[1.5px] md:border-[#c5c6d0]/50 hover:bg-[#021541]/10 transition-colors md:border-l-4 md:border-l-[#021541] border border-[#021541] md:border-t-0 md:border-r-0 md:border-y-0 p-2 md:p-0 rounded-lg md:rounded-none">
                    <td className="p-2 md:p-4 text-center font-bold text-[#021541] md:w-16 flex items-center md:table-cell">
                      <span className="w-4 text-center inline-block">2</span>
                    </td>
                    <td className="p-2 md:p-4 flex items-center gap-3 flex-1 md:flex-none">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu4KgePdc0J6x_iLFRaEl11UjkiwIYYhXzj0Bl0Z7mLl20xDMFsf5Y9jbLGKj1mgvNwwq83zmSmYRC6YhmDbnsaxG6daoW_YXNhlTpTJ-yj94ffNQv7npSNp8I-bDgF6XNA7R7AuXZY9vM1ZfgqpNwtI1SC-7oieOAINkxLRoP2ffcoykFAOUuzx8YU5P3g3y_UYo9k0oq0GA8Q6Z26gJgkAzfJCs-YyZJXeKk7GEO1AxrQebnupjf" 
                        alt="You" 
                        className="w-10 h-10 md:w-8 md:h-8 rounded-full border-2 border-[#021541] object-cover" 
                      />
                      <div className="flex flex-col md:block">
                        <span className="font-bold text-[#021541] text-[14px] md:text-[16px]">You</span>
                        <span className="md:hidden text-[12px] text-[#45464f]">1180 pts</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell p-4 text-center font-bold">1,180</td>
                    <td className="p-2 md:p-4 md:table-cell flex items-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#f87171] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">L</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#c5c6d0] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#c5c6d0] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#f87171] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">L</span></div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="flex md:table-row justify-between items-center bg-transparent hover:bg-[#f4f3f1] transition-colors p-2 md:p-0 rounded-lg md:rounded-none">
                    <td className="p-2 md:p-4 text-center font-bold text-[#45464f] md:w-16 flex items-center md:table-cell md:font-normal">
                      <span className="w-4 text-center inline-block">3</span>
                    </td>
                    <td className="p-2 md:p-4 flex items-center gap-3 flex-1 md:flex-none">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-FyY1t_uvUsDx8haH_FHtLzGkmKktDAWLEiaGulPBUV-j1MylLEYKoblNVoTCyMwKoJlwVU4nucvg5tTU7ql8RdK1UuahEAQiEBdOQctFo7X-CKrZC9WKLEa9JWc9uooNvwqI6e3Y3EJKAIlJI3YC_dKKkLZqTWyc60IigvzYZM0yMTwAzfL0CwfxAVCzmQ_0blDmOWNmVsRv1Bem8r76AoGsUkwurMH7Bl2kkUenNIr22XxWzv-Q" 
                        alt="Sam Taylor" 
                        className="w-10 h-10 md:w-8 md:h-8 rounded-full border border-[#c5c6d0] object-cover" 
                      />
                      <div className="flex flex-col md:block">
                        <span className="font-bold text-[#45464f] md:text-[#1a1c1a] md:font-semibold text-[14px] md:text-[16px]">Sam Taylor</span>
                        <span className="md:hidden text-[12px] text-[#757680]">1050 pts</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell p-4 text-center">1,050</td>
                    <td className="p-2 md:p-4 md:table-cell flex items-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#c5c6d0] md:bg-[#f87171] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">L</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#735c00] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                        <div className="w-2 h-2 md:w-6 md:h-6 rounded-full bg-[#c5c6d0] md:bg-[#4ade80] flex items-center justify-center text-white text-[10px] md:text-xs font-bold"><span className="hidden md:inline">W</span></div>
                      </div>
                    </td>
                  </tr>

                  {/* Row 4 (Desktop only essentially) */}
                  <tr className="hidden md:table-row hover:bg-[#f4f3f1] transition-colors text-[#757680]">
                    <td className="p-4 text-center w-16">4</td>
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#e9e8e5] border border-[#c5c6d0] flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span>Alex Rivera</span>
                    </td>
                    <td className="p-4 text-center">980</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-70">
                        <div className="w-6 h-6 rounded-full bg-[#f87171] flex items-center justify-center text-white text-xs font-bold">L</div>
                        <div className="w-6 h-6 rounded-full bg-[#f87171] flex items-center justify-center text-white text-xs font-bold">L</div>
                        <div className="w-6 h-6 rounded-full bg-[#4ade80] flex items-center justify-center text-white text-xs font-bold">W</div>
                        <div className="w-6 h-6 rounded-full bg-[#f87171] flex items-center justify-center text-white text-xs font-bold">L</div>
                        <div className="w-6 h-6 rounded-full bg-[#f87171] flex items-center justify-center text-white text-xs font-bold">L</div>
                      </div>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column: Matches & History */}
        <div className="lg:col-span-1 flex flex-col gap-5 md:gap-6">
          
          {/* Upcoming Matches */}
          <section className="flex flex-col gap-4">
            <h2 className="md:hidden font-bold text-[24px] leading-[32px] text-[#021541] flex items-center gap-2">
              <CalendarDays className="w-6 h-6" /> Upcoming Match
            </h2>
            <h3 className="hidden md:flex font-bold text-[24px] leading-[32px] mb-2 items-center gap-2">
              <CalendarDays className="w-6 h-6 text-[#735c00]" />
              Upcoming
            </h3>

            <div className="bg-[#ffffff] border-[1.5px] border-[#021541] rounded-2xl p-5 md:p-6 shadow-[0_4px_12px_rgba(2,21,65,0.08)] flex flex-col gap-4 relative overflow-hidden">
              <div className="md:hidden absolute -right-4 -top-4 w-24 h-24 bg-[#b5c5f9] rounded-full opacity-20 blur-xl"></div>
              <div className="flex justify-between items-start z-10">
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-[#735c00] tracking-wider uppercase mb-1">Tomorrow, 2:00 PM</span>
                  <h4 className="font-bold text-[18px] leading-tight text-[#021541] md:text-[#1a1c1a]">AI in Healthcare: Boon or Bane?</h4>
                </div>
                {/* Mobile Gavel Icon */}
                <span className="md:hidden bg-[#efeeeb] text-[#1a2b56] p-2 rounded-full">
                  <Gavel className="w-5 h-5" />
                </span>
                {/* Desktop Ranked Badge */}
                <div className="hidden md:flex bg-[#f4f3f1] border border-[#c5c6d0] rounded-full px-3 py-1 items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4ade80]"></span>
                  <span className="font-semibold text-[12px]">Ranked</span>
                </div>
              </div>

              <div className="flex items-center gap-3 z-10 mt-1 md:mt-0 bg-transparent md:bg-[#f4f3f1] p-0 md:p-3 rounded-xl">
                <img 
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#021541] object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzq_zdPphhkMQMFr8Vlu0_wcjIX8oG1sl71CTpyqlyjtkvSwIZXA0-xHhb8wVRBzeXGa1Joj1FXEDN-UaKpYUYqxVm18o5fia1BUP9GpcQLKr3Jxd_XrxFiygfDGcs9Q9j7AL23d8a6xpUc-pl5QLw8A4Cms4r6_rJPV79M1u_qcvmSQRMFHctBbHxisFukaNoSMhPJvAwbz5DYnSTBXNUc7YpO0ZCT0yDRQj7Qc41avwIye78bVxe" 
                  alt="Jury" 
                />
                <div>
                  <p className="font-semibold text-[12px] text-[#757680]">JURY MENTOR</p>
                  <p className="font-bold text-[14px] text-[#021541] md:text-[#1a1c1a]">Dr. Elena Rostova</p>
                </div>
              </div>
              
              <button className="cursor-pointer w-full bg-[#021541] text-[#ffffff] font-semibold text-[14px] py-2.5 md:py-3 rounded-xl shadow-[0_4px_12px_rgba(2,21,65,0.08)] active:translate-y-1 active:shadow-none transition-all mt-1 md:mt-2">
                Prepare Arguments
              </button>
            </div>
          </section>

          {/* Previous Debates */}
          <section className="flex flex-col gap-4 mt-2 md:mt-0">
            <h2 className="md:hidden font-bold text-[24px] leading-[32px] text-[#021541] flex items-center gap-2">
              <History className="w-6 h-6" /> Recent Debates
            </h2>
            <h3 className="hidden md:flex font-bold text-[24px] leading-[32px] mb-2 mt-4 items-center gap-2">
              <History className="w-6 h-6 text-[#757680]" />
              History
            </h3>

            <div className="flex flex-col gap-3 md:gap-4">
              
              {/* History Card 1 */}
              <div className="bg-[#ffffff] border-[1.5px] border-[#c5c6d0] rounded-2xl p-4 md:p-5 hover:border-[#021541] transition-colors cursor-pointer group flex flex-col gap-2 md:gap-0">
                <div className="flex justify-between items-center md:items-start mb-1 md:mb-2">
                  <h4 className="font-semibold text-[16px] md:font-bold md:text-[18px] text-[#021541] md:text-[#1a1c1a] group-hover:text-[#021541] transition-colors">Universal Basic Income</h4>
                  {/* Desktop Date */}
                  <span className="hidden md:inline font-semibold text-[12px] text-[#757680]">OCT 12</span>
                  {/* Mobile Badge */}
                  <div className="md:hidden flex items-center gap-1 bg-[#fed65b] px-2 py-1 rounded-md">
                    <Star className="w-3 h-3 text-[#745c00] fill-current" />
                    <span className="font-semibold text-[12px] text-[#745c00]">8.5/10</span>
                  </div>
                </div>
                
                <p className="md:hidden text-[14px] text-[#45464f] line-clamp-2">Strong opening statement, but rebuttal needed more factual grounding.</p>

                <div className="flex items-center justify-between mt-1 md:mt-4">
                  {/* Desktop Stars */}
                  <div className="hidden md:flex text-[#fed65b]">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 text-[#c5c6d0]" />
                  </div>
                  <button className="text-[#021541] font-semibold text-[14px] flex items-center gap-1 hover:text-[#735c00] md:hover:underline transition-colors mt-2 md:mt-0 p-0 md:p-0">
                    View Feedback <ArrowRight className="w-4 h-4 md:hidden" />
                  </button>
                </div>
              </div>

              {/* History Card 2 */}
              <div className="bg-[#ffffff] border-[1.5px] border-[#c5c6d0] rounded-2xl p-4 md:p-5 hover:border-[#021541] transition-colors cursor-pointer group flex flex-col gap-2 md:gap-0 opacity-100 md:opacity-100">
                <div className="flex justify-between items-center md:items-start mb-1 md:mb-2">
                  <h4 className="font-semibold text-[16px] md:font-bold md:text-[18px] text-[#021541] md:text-[#1a1c1a] group-hover:text-[#021541] transition-colors line-clamp-2 md:line-clamp-none pr-4 md:pr-0">
                    <span className="md:hidden">Space Exploration vs. Ocean Exploration</span>
                    <span className="hidden md:inline">AI Regulation Ethics</span>
                  </h4>
                  {/* Desktop Date */}
                  <span className="hidden md:inline font-semibold text-[12px] text-[#757680]">OCT 05</span>
                  {/* Mobile Badge */}
                  <div className="md:hidden flex items-center gap-1 bg-[#e3e2e0] px-2 py-1 rounded-md shrink-0">
                    <Star className="w-3 h-3 text-[#45464f] fill-current" />
                    <span className="font-semibold text-[12px] text-[#45464f]">7.2/10</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1 md:mt-4">
                  {/* Desktop Stars */}
                  <div className="hidden md:flex text-[#fed65b]">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 text-[#c5c6d0]" />
                    <Star className="w-5 h-5 text-[#c5c6d0]" />
                  </div>
                  <button className="text-[#021541] font-semibold text-[14px] flex items-center gap-1 hover:text-[#735c00] md:hover:underline transition-colors mt-2 md:mt-0 p-0 md:p-0">
                    View Feedback <ArrowRight className="w-4 h-4 md:hidden" />
                  </button>
                </div>
              </div>

            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
