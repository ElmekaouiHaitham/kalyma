"use client";

import Image from "next/image";
import { 
  Calendar, 
  Clock, 
  Video, 
  CalendarDays, 
  History, 
  Star 
} from "lucide-react";

export default function SessionsPage() {
  return (
    <main className="max-w-7xl mx-auto px-5 md:px-10 pt-20 pb-8 md:py-12 flex flex-col gap-8 md:gap-10 text-[#1a1c1a]">
      {/* Page Title */}
      <header>
        <h1 className="text-[28px] md:text-[32px] leading-[34px] md:leading-[40px] font-extrabold text-[#1a2b56] tracking-tight">
          My Sessions
        </h1>
        <p className="text-[16px] leading-[24px] text-[#45464f] mt-2 block md:hidden">
          Manage your upcoming check-ins and review past learnings.
        </p>
      </header>

      {/* Upcoming Sessions */}
      <section className="flex flex-col gap-4 md:gap-5">
        <h2 className="text-[14px] leading-[20px] font-semibold text-[#45464f] uppercase tracking-wider mb-2 md:hidden">
          Upcoming
        </h2>
        <h2 className="hidden md:flex font-bold text-[24px] leading-[32px] text-[#1a2b56] tracking-tight items-center gap-2">
          <Calendar className="w-6 h-6 text-[#1a2b56]" />
          Upcoming Sessions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Card 1 */}
          <article className="bg-[#ffffff] rounded-xl p-4 md:p-5 shadow-[0_4px_12px_rgba(26,43,86,0.05)] border-[1.5px] border-[#1a2b56] md:border-transparent md:hover:border-[#1a2b56] transition-all duration-300 flex flex-col gap-4 relative group">
            <div className="hidden md:inline-flex items-center gap-2 bg-[#dae1ff] text-[#1a2b56] font-semibold text-[12px] leading-[16px] px-3 py-1.5 rounded-full w-fit">
              <Clock className="w-4 h-4" />
              Today, 4:00 PM
            </div>
            {/* Mobile Top Row */}
            <div className="flex justify-between items-start md:hidden">
              <div className="flex items-center gap-2 text-[#1a2b56] font-semibold text-[12px] leading-[16px] bg-[#fed65b]/30 px-3 py-1 rounded-full">
                <Calendar className="w-4 h-4" />
                <span>Today, 3:00 PM - 4:00 PM</span>
              </div>
              <button className="cursor-pointer bg-[#1a2b56] text-[#ffffff] font-semibold text-[14px] leading-[20px] px-4 py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-md">
                Join Call
              </button>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-[1.5px] border-[#dae1ff] shrink-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsbIRC2-IMrmf_BmRliPvas1-oMzNxEW6fyzdkARijLxuBNBNZMPaFn3tTZq4S4zBp6oNtzY8yATQ-ElmFBBo7owtPB3HoJkhMV1B7De9BDNAcmQDUi0z7RQptIE1xlSiXnErY-QrUfEi3LbWRcU2oaG0vXuH_YYWg7LgLhTfszwasiu1iNjjXXk__ypDZDtNsh8hJoYdsZnz0ukjMRSanyH_m1qqAdIobWRJ4P52mKW-3q_Ybyk1B"
                  alt="Elena Rodriguez"
                  className="w-full h-full object-cover hidden md:block"
                />
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC20h4wa2BISU8Kxl_bsOziNyQ-TNYr56IZC-int13jfj8Y5pcjgphkulgSumXNgQxxGBW-8w16ocOJ03tYYcBukzxTDwnxFSOKmJZHg2-Z5KLS65aSCeMQEU1mD2umLSBJqhif4C65RrsvvYT6YDR8xIu1N49F4b7odng60MaXAMEUwnLx82GkV-L4kpRjZCkVyIncm8sENbcp75-3TbUCcDGjCPq1gJ2xvmzMfAMAt8kMpERwWt3P"
                  alt="Dr. Elena Rostova"
                  className="w-full h-full object-cover block md:hidden"
                />
              </div>
              <div>
                <h3 className="font-bold text-[16px] leading-[24px] text-[#1a2b56] leading-tight">
                  <span className="hidden md:inline">Elena Rodriguez</span>
                  <span className="md:hidden">Dr. Elena Rostova</span>
                </h3>
                <p className="font-semibold text-[13px] leading-[18px] text-[#45464f] mt-0.5">
                  <span className="hidden md:inline">Spanish • Conversational</span>
                  <span className="md:hidden">UX Research Methodologies</span>
                </p>
              </div>
            </div>
            <p className="text-[14px] leading-[20px] text-[#45464f] line-clamp-2">
              <span className="hidden md:inline">Expert in conversational Spanish and regional dialects with over 10 years of experience teaching dynamic, immersive lessons...</span>
              <span className="md:hidden">We will be diving into qualitative synthesis techniques and how to structure your affinity mapping sessions for better insights...</span>
            </p>
            <button className="cursor-pointer hidden md:flex mt-auto w-full bg-[#1a2b56] text-[#ffffff] rounded-lg py-2.5 font-semibold text-[14px] leading-[20px] items-center justify-center gap-2 hover:bg-[#021541] hover:shadow-[0_4px_12px_rgba(26,43,86,0.15)] transition-all group-hover:-translate-y-0.5">
              <Video className="w-[18px] h-[18px]" />
              Join Session
            </button>
          </article>

          {/* Card 2 */}
          <article className="bg-[#ffffff] rounded-xl p-4 md:p-5 shadow-[0_4px_12px_rgba(26,43,86,0.05)] border-[1.5px] border-[#c5c6d0] md:border-transparent md:hover:border-[#1a2b56] transition-all duration-300 flex flex-col gap-4 relative group">
            <div className="inline-flex items-center gap-2 md:bg-[#e3e2e0] text-[#45464f] font-semibold text-[12px] leading-[16px] px-0 md:px-3 py-0 md:py-1.5 rounded-full w-fit">
              <CalendarDays className="w-4 h-4" />
              Tomorrow, 10:00 AM
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-[1.5px] border-[#c5c6d0] md:border-[#dae1ff] shrink-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIlP2bgDMNSl_Fk0led9vnJb_PjlReesRurUNRjrXHudgQ7qx-4xSsvvaEWvfFn2yvdiIkJb7LDMrSphef6VILMViyQNNBjLa9Np-oIu32CkfifhT8_4K-vVqRqBw5PM3GuBx-THj6qa2LPpD5zTmpa7vmsHTcU3wkiPWZcVpwoBh2zbpzKhK0K3feWIoaL7Mnz2bJBFwkaWdqgij6ITg4mQzdb2m_ZSq2lfKOVNVFlIgMHfLSwXxg"
                  alt="David Kim"
                  className="w-full h-full object-cover hidden md:block"
                />
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuABnNdmFSrDlU2nombzTQVI3pxb21a2kEGTnRVVNkYZ6FPMt_G7zWusXacDb8S-TTEY_17Cmy9Dit_qpuLfNphQOvDfaWP3ZhK4JKMJWlA0nnfxiEjHOMqSCPobhAf7ju8f9o42Me0V_mvHOeEx_zMedgtr1nItu-xTYWSnvPbHfi9jf-Q4DxIhTChX1_J4MRLeza6GEZcj5WrLT6uqn9U--uTtllCkp3ehBhjW7T8iGk0_RfI_VaOe"
                  alt="Marcus Chen"
                  className="w-full h-full object-cover block md:hidden"
                />
              </div>
              <div>
                <h3 className="font-bold text-[16px] leading-[24px] text-[#1a2b56] leading-tight">
                  <span className="hidden md:inline">David Kim</span>
                  <span className="md:hidden">Marcus Chen</span>
                </h3>
                <p className="font-semibold text-[13px] leading-[18px] text-[#45464f] mt-0.5">
                  <span className="hidden md:inline">Korean • Beginner</span>
                  <span className="md:hidden">Advanced Prototyping</span>
                </p>
              </div>
            </div>
            <p className="text-[14px] leading-[20px] text-[#1a1c1a] md:text-[#45464f] line-clamp-2">
              <span className="hidden md:inline">Patient and supportive tutor specializing in foundational grammar and everyday vocabulary for absolute beginners...</span>
              <span className="md:hidden">Reviewing your latest Framer prototypes and discussing motion design principles for micro-interactions...</span>
            </p>
            <button className="cursor-pointer hidden md:flex mt-auto w-full bg-[#1a2b56] text-[#ffffff] rounded-lg py-2.5 font-semibold text-[14px] leading-[20px] items-center justify-center gap-2 hover:bg-[#021541] hover:shadow-[0_4px_12px_rgba(26,43,86,0.15)] transition-all group-hover:-translate-y-0.5">
              <Video className="w-[18px] h-[18px]" />
              Join Session
            </button>
          </article>
        </div>
      </section>

      {/* Previous Sessions */}
      <section className="flex flex-col gap-4 md:gap-5 mt-2">
        <h2 className="text-[14px] leading-[20px] font-semibold text-[#45464f] uppercase tracking-wider mb-2 md:hidden">
          Previous
        </h2>
        <h2 className="hidden md:flex font-bold text-[24px] leading-[32px] text-[#1a2b56] tracking-tight items-center gap-2 opacity-90">
          <History className="w-6 h-6 text-[#1a2b56]" />
          Previous Sessions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Previous Card 1 */}
          <article className="bg-[#f4f3f1] md:bg-[#efeeeb] rounded-xl p-4 md:p-5 border-none md:border-[1.5px] border-[#e3e2e0] flex flex-col gap-4">
            <div className="flex justify-between items-start md:opacity-100 opacity-75">
              <div className="inline-flex items-center gap-2 text-[#45464f] font-semibold text-[12px] leading-[16px] w-fit">
                <History className="w-4 h-4 md:hidden" />
                <Calendar className="w-4 h-4 hidden md:block" />
                Oct 12, {`10:00 AM`}
              </div>
              {/* Mobile Rating */}
              <div className="flex md:hidden text-[#735c00] items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4 opacity-75 md:opacity-100">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden grayscale-[20%] opacity-90 shrink-0 border border-[#c5c6d0] md:border-none">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvmzmRCREmh5UpJwIQmKVjqmxXlmLa-Hm7mxb7MN3Z6oUQIkJ4usxNsMsMDi-3xVxjGYxjjiM1L0M58hXIPl5AU9ZOBH4RzVO9tlROkvU15XjsmQQyjd7-Zd0rOHEhn1DZHkB5rKRX63FWQoJFQ9o1OaLcErjSNM08gENdd3820i2j8AOXaNFnbwGPS-1ZYBGZK6wSv2ic2s988UOIHfjq5oc-2k-InKdUTrKmn4M2cyZ2DIQ6kZt7"
                  alt="Marc Dubois"
                  className="w-full h-full object-cover hidden md:block"
                />
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWCtezPNhVfm7Eh8USH1jAjZAciT8hfJ7ApnsAlx-vJf_szOX3W1IaAc8PhCp7Gi8RerD0zMOEEyG8T0_Ab1dQdYebf02tDNoUMVf83yE56gWLibh7eL-aMWUZTJ2zvuUDZsXPLPAesieRO-lGAUWols-J-U5CbEIJpOI4hXSVUSNB5lYeKtNmfnGvapQrb4oH123W-tWuHdTaSO4TefvBMN08cmiMC1fJqIMYULQ6yghiPJmhz_H-"
                  alt="Dr. Elena Rostova"
                  className="w-full h-full object-cover block md:hidden"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[16px] leading-[24px] text-[#1a2b56] leading-tight">
                  <span className="hidden md:inline">Marc Dubois</span>
                  <span className="md:hidden">Dr. Elena Rostova</span>
                </h3>
                <p className="md:hidden font-semibold text-[13px] leading-[18px] text-[#45464f]">User Interviews Prep</p>
                {/* Desktop Rating */}
                <div className="hidden md:flex items-center gap-1 text-[#735c00] mt-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-[14px] h-[14px] fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-[14px] leading-[20px] text-[#1a1c1a] md:text-[#45464f] opacity-75 md:opacity-80 line-clamp-2">
              <span className="hidden md:inline">Focused on mastering subjunctive conjugations and conversational flow in professional settings...</span>
              <span className="md:hidden">Discussed the script for the upcoming user interviews. Great progress on identifying unbiased questions...</span>
            </p>
            <button className="cursor-pointer hidden md:flex mt-auto w-full border-[1.5px] border-[#1a2b56] text-[#1a2b56] rounded-lg py-2.5 font-semibold text-[14px] leading-[20px] items-center justify-center gap-2 hover:bg-[#e9e8e5] transition-colors">
              View Details
            </button>
            <div className="md:hidden mt-2 border-t border-[#c5c6d0]/30 pt-3 flex justify-between items-center">
              <span className="font-semibold text-[14px] leading-[20px] text-[#1a2b56]">Notes available</span>
              <button className="cursor-pointer text-[#1a2b56] font-semibold text-[14px] leading-[20px] hover:underline">View Summary</button>
            </div>
          </article>

          {/* Previous Card 2 */}
          <article className="hidden md:flex bg-[#efeeeb] rounded-xl p-5 border-[1.5px] border-[#e3e2e0] flex-col gap-4">
            <div className="inline-flex items-center gap-2 text-[#45464f] font-semibold text-[12px] leading-[16px] w-fit">
              <Calendar className="w-4 h-4" />
              Oct 05, 2:15 PM
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden grayscale-[20%] opacity-90 shrink-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIUn11YROkMr7Y0t9_zG8Sbbag67gGI-pRg3bEiLwmh5iKfqDAhCk2FNT8gUOQk7mi95UUC3Xm4tFTjaYDAYCKlRXtoRddOwb7IUKpeUwoW7BQ8PBbE091walN1MIvax-rrjmcHWyXEaJ028MMI34vOD-lLjJw8vMPMet9mFugXOC0ShQ_XQrelLu5Xk0QKfvNlbXNtj100mswqdHpEjOT-chEWlQFTBfXRk_IizDFmWLuMVQf8FRZ"
                  alt="Yuki Tanaka"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[16px] leading-[24px] text-[#1a2b56] leading-tight">
                  Yuki Tanaka
                </h3>
                <div className="flex items-center gap-1 text-[#735c00] mt-0.5">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-[14px] h-[14px] fill-current" />
                  ))}
                  <Star className="w-[14px] h-[14px] text-[#c5c6d0]" />
                </div>
              </div>
            </div>
            <p className="text-[14px] leading-[20px] text-[#45464f] opacity-80 line-clamp-2">
              Reviewed Katakana fundamentals and practiced ordering food in simulated restaurant scenarios...
            </p>
            <button className="cursor-pointer mt-auto w-full border-[1.5px] border-[#1a2b56] text-[#1a2b56] rounded-lg py-2.5 font-semibold text-[14px] leading-[20px] flex items-center justify-center gap-2 hover:bg-[#e9e8e5] transition-colors">
              View Details
            </button>
          </article>
        </div>
      </section>
    </main>
  );
}
