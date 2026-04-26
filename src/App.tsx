import React, { useEffect, useRef, useState } from "react";
import {
  GraduationCap,
  Navigation,
  Wifi,
  Globe,
  ChevronDown,
  Play,
  Pause,
  Cpu,
  Zap,
  Radio,
} from "lucide-react";
import AudioControlButton from "./components/AudioControlButton";
import { supabase } from "./lib/supabaseClient";
import CountdownSection from "./components/CountdownSection";
import LocationSection from "./components/LocationSection";
import PhotoAlbum from "./components/PhotoAlbum";
import RsvpGuestbookSection from "./components/RsvpGuestbookSection";

const userName = "Cao Sỹ Dương";
const graduationDate = new Date("2026-05-09T09:00:00").getTime();

const albumPhotos = [
  {
    url: "assert/photo-1773332585771-5c9c5fa642d1.avif",
    caption: "Kỷ niệm ngày đầu vào trường",
  },
  {
    url: "assert/photo-1773423386509-b57f17224b30.avif",
    caption: "Những đêm trực lab cùng đồ án",
  },
  {
    url: "assert/photo-1770010314670-464a6d221858.avif",
    caption: "Những đêm trực lab cùng đồ án",
  },
];

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type GuestbookData = {
  name: string;
  message: string;
};

type RsvpData = {
  name: string;
  //   email: string | null;
  message: string;
  attending: "yes" | "no" | "";
};

type Message = {
  id: string;
  name: string;
  message: string;
  date: string;
};

const initialGuestbook: GuestbookData = { name: "", message: "" };
const initialRsvp: RsvpData = { name: "", message: "", attending: "" };

function calculateTimeLeft(): TimeLeft {
  const difference = graduationDate - new Date().getTime();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

const App = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [isPlaying, setIsPlaying] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [rsvpData, setRsvpData] = useState<RsvpData>(initialRsvp);
  const [guestbookData, setGuestbookData] =
    useState<GuestbookData>(initialGuestbook);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGeneratingWish, setIsGeneratingWish] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpFeedback, setRsvpFeedback] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrl =
    "assert/bombinsound-gentle-peaceful-gentle-music-33-second-499510.mp3";

  useEffect(() => {
    const timer = window.setInterval(
      () => setTimeLeft(calculateTimeLeft()),
      1000,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadRecentMessages = async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("id, name, message, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Supabase fetch error:", error);
        return;
      }

      setMessages(
        (data ?? []).map((row) => ({
          id: row.id as string,
          name: row.name ?? "Anonymous",
          message: row.message ?? "",
          date: row.created_at
            ? new Date(row.created_at).toLocaleString("vi-VN")
            : "Vừa xong",
        })),
      );
    };

    loadRecentMessages();
  }, []);

  const handleStartExperience = () => {
    setShowContent(true);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (showContent && audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => {
        // Audio may be blocked by browser until user interaction
      });
    }
  }, [showContent, isPlaying]);

  //   Option using AI for generate Message.
  //   const generateWishWithAI = async () => {
  //     if (!guestbookData.name) return;
  //     setIsGeneratingWish(true);

  //     const apiKey = import.meta.env.VITE_GOOGLE_API_KEY ?? '';
  //     const prompt = `Viết lời chúc tốt nghiệp cho Cao Sỹ Dương, Kỹ sư tại Huawei, chuyên ngành 5.5G/6G. Người gửi: ${guestbookData.name}. Phong cách: Sang trọng, công nghệ tương lai, dùng thuật ngữ viễn thông hiện đại.`;

  //     try {
  //       const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  //       });
  //       const data = await res.json();
  //       const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  //       setGuestbookData({ ...guestbookData, message: text || 'Xin lỗi, không thể tạo lời chúc lúc này.' });
  //     } catch (error) {
  //       setGuestbookData({ ...guestbookData, message: 'Kết nối 6G không ổn định, hãy thử lại!' });
  //     } finally {
  //       setIsGeneratingWish(false);
  //     }
  //   };

  //   const addGuestbookMessage = () => {
  //     if (!guestbookData.name || !guestbookData.message) return;
  //     setMessages((prev) => [{ id: Date.now().toString(), name: guestbookData.name, message: guestbookData.message, date: 'Vừa xong' }, ...prev]);
  //     setGuestbookData(initialGuestbook);
  //   };

  const handleRsvpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRsvpFeedback("Đang gửi RSVP...");
    setRsvpSubmitted(false);

    const { error } = await supabase.from("candidates").insert([
      {
        name: rsvpData.name,
        message: rsvpData.message || null,
        // email: rsvpData.email || null,
        attending: rsvpData.attending === "yes",
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      setRsvpFeedback("Không thể gửi RSVP. Vui lòng thử lại.");
      return;
    }

    setRsvpSubmitted(true);
    setRsvpFeedback("Cảm ơn! Thông tin RSVP của bạn đã được ghi nhận.");
    setRsvpData(initialRsvp);
    setTimeout(() => {
      const loadRecentMessages = async () => {
        const { data, error } = await supabase
          .from("candidates")
          .select("id, name, message, created_at")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) {
          console.error("Supabase fetch error:", error);
          return;
        }

        setMessages(
          (data ?? []).map((row) => ({
            id: row.id as string,
            name: row.name ?? "Anonymous",
            message: row.message ?? "",
            date: row.created_at
              ? new Date(row.created_at).toLocaleString("vi-VN")
              : "Vừa xong",
          })),
        );
      };

      loadRecentMessages();
    }, 500);
  };

  if (!showContent) {
    return (
      <div className="h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 mb-8 relative">
          <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20" />
          <div className="relative bg-white rounded-full p-4 shadow-2xl border border-red-100">
            <GraduationCap size={56} className="text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl font-serif italic text-slate-800 mb-2">
          Lời mời từ
        </h2>
        <h1 className="text-4xl font-bold text-red-600 mb-8 uppercase tracking-widest">
          {userName}
        </h1>
        <button
          onClick={handleStartExperience}
          className="group relative px-12 py-4 bg-white border border-red-600 text-red-600 font-bold rounded-full overflow-hidden transition-all hover:text-white"
        >
          <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative z-10 flex items-center">
            KÍCH HOẠT TRẢI NGHIỆM <Play size={16} className="ml-2" />
          </span>
        </button>
        <p className="mt-8 text-slate-400 font-mono text-xs uppercase tracking-widest">
          Huawei 5.5G/6G Technology Exhibition
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-red-100 overflow-x-hidden">
      <audio ref={audioRef} loop src={audioUrl} />
      <AudioControlButton
        audioRef={audioRef}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />

      <section className="relative h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-red-50/50 skew-x-12 transform origin-top translate-x-20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(220,38,38,0.05)_0%,transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(#dc2626 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="flex justify-center space-x-6 mb-8 text-red-600 opacity-60">
            <Cpu size={24} /> <Radio size={24} /> <Zap size={24} />
          </div>
          <p className="text-red-600 font-mono tracking-[0.5em] mb-4 uppercase font-bold text-sm">
            Beyond Connecting // 6G Era
          </p>
          <h1 className="text-7xl md:text-[10rem] font-black text-slate-900 leading-none mb-4 tracking-tighter">
            HUST <span className="text-red-600">26</span>
          </h1>
          <h2 className="text-3xl md:text-5xl font-serif italic text-slate-700 mb-12">
            Lễ Tốt Nghiệp Cao Sỹ Dương
          </h2>
          <div className="flex flex-wrap justify-center gap-4 text-slate-500 font-mono text-sm uppercase">
            <span className="px-4 py-2 bg-slate-100 rounded-full flex items-center">
              <Wifi size={14} className="mr-2" /> 5.5G Tech Specialist
            </span>
            <span className="px-4 py-2 bg-slate-100 rounded-full flex items-center">
              <Globe size={14} className="mr-2" /> Huawei Infrastructure
            </span>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-red-600" />
        </div>
      </section>

      <CountdownSection timeLeft={timeLeft} />
      <PhotoAlbum photos={albumPhotos} />
      <LocationSection />
      <RsvpGuestbookSection
        rsvpData={rsvpData}
        setRsvpData={setRsvpData}
        rsvpSubmitted={rsvpSubmitted}
        rsvpFeedback={rsvpFeedback}
        onRsvpSubmit={handleRsvpSubmit}
        guestbookData={guestbookData}
        setGuestbookData={setGuestbookData}
        isGeneratingWish={isGeneratingWish}
        // generateWishWithAI={generateWishWithAI}
        // addGuestbookMessage={addGuestbookMessage}
        messages={messages}
      />

      <footer className="py-12 text-center border-t border-slate-100">
        <p className="text-slate-400 font-mono text-xs tracking-[0.4em] mb-4">
          HUAWEI TECHNOLOGIES CO., LTD // 6G RESEARCH
        </p>
        <p className="text-slate-900 font-bold uppercase">
          Cao Sỹ Dương - Bách Khoa Hà Nội
        </p>
      </footer>
    </div>
  );
};

export default App;
