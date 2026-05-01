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
import { supabase } from "./lib/supabaseClient";
import CountdownSection from "./components/CountdownSection";
import LocationSection from "./components/LocationSection";
import PhotoAlbum from "./components/PhotoAlbum";
import RsvpGuestbookSection from "./components/RsvpGuestbookSection";

const userName = "Cao Sy Duong Graduation Day";
const graduationDate = new Date("2026-05-09T09:00:00").getTime();

const albumPhotos = [
  {
    url: "assets/album-1.jpeg",
    caption: "Overnight with me",
  },
  {
    url: "assets/album-2.jpeg",
    caption: "Ngày lên thớt cuối cùng",
  },
  {
    url: "assets/album-3.jpeg",
    caption: "Tạm biệt HUST",
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
    "assets/có hẹn với thanh xuân MONSTAR GREY D - Lời bài hát tải nhạc Zing.mp3";

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
      <div className="bg-slate-50 flex flex-col items-center justify-center p-4 h-screen">
        <div className="w-24 h-24 mb-8 relative">
          <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20" />
          <div className="relative bg-white rounded-full p-4 shadow-2xl border border-red-100">
            <GraduationCap size={56} className="text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl font-serif italic text-slate-800 mb-2">
        You are cordially invited to
        </h2>
        <h1 className="text-center text-4xl font-bold text-red-600 mb-8 uppercase tracking-widest">
          {userName}
        </h1>
        <button
          onClick={handleStartExperience}
          className="group relative px-12 py-4 bg-white border border-red-600 text-red-600 font-bold rounded-full overflow-hidden transition-all hover:text-white"
        >
          <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative z-10 flex items-center">
            Ready for it <Play size={16} className="ml-2" />
          </span>
        </button>
        <p className="mt-8 text-slate-400 font-mono text-xs uppercase tracking-widest">
          One love, one future
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-red-100 overflow-x-hidden">
      <audio ref={audioRef} loop src={audioUrl} />

      <section className="relative flex items-center justify-center pt-10">
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
          <p className="text-left text-black-600 font-serif tracking-[0.15em] mb-4 px-8 font-bold text-sm">
            Dear, 
          </p>
          <p className="text-justify text-black-600 font-serif tracking-[0.15em] mb-4 px-8 font-bold text-sm">
            To all my friends, colleagues, and loved ones who have been part of this incredible journey. 
          </p>
          <p className="text-left text-black-600 font-serif tracking-[0.15em] mb-4 px-8 font-bold text-sm">
            You are officially invited to join!
          </p>
          <h1 className="text-7xl md:text-[10rem] font-black text-slate-900 leading-none mb-4 tracking-tighter">
            HUST <span className="text-red-600">26</span>
          </h1>
          <h2 className="text-center text-3xl md:text-5xl font-serif italic text-slate-700 mb-6">
            {userName}
          </h2>
          <div className="mx-auto max-w-4xl text-left rounded-3xl border border-red-100 bg-white/80 p-8 text-slate-700 shadow-xl shadow-red-100/50 backdrop-blur-sm md:text-lg">
            <p className="mb-4 italic text-slate-800">
              “Bốn năm Bách Khoa không hề nhẹ nhàng: những ngày dài, đêm trắng và những mùa thi thật hối hả. Nhưng chính những lúc ấy đã dạy tôi đứng vững, tin vào bản thân và trưởng thành hơn. Nhìn lại hành trình đã qua, bản thân đã học và nhận được rất nhiều, không chỉ là kiến thức, kỹ năng, trải nghiệm mà còn có cả tình bạn và thanh xuân thật đáng nhớ.
            </p>
            <p className="mb-4 italic text-slate-800">
              Hành trình khép lại, mở ra nhiều chương mới. Tốt nghiệp là cánh cửa đến tương lai, nơi bản thân mang theo ước mơ và niềm tin để tiếp tục cố gắng.
            </p>
            <p className="font-semibold text-slate-900 tracking-tight">
              Tôi cũng muốn gửi lời cảm ơn chân thành nhất đến thầy cô – những người đã tận tâm dìu dắt, đến bạn bè – những người đã cùng tôi chia sẻ từng khoảnh khắc vui buồn, và đến gia đình – điểm tựa vững chắc luôn âm thầm ủng hộ tôi suốt hành trình này."
            </p>
            <p className="mt-6 text-right font-bold text-red-600">
              ~ Cao Sỹ Dương ET-E4 K66 ~
            </p>
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
        <p className="text-slate-400 font-mono text-xs tracking-[0.2em] mb-4">
          Hanoi University of Science and Technology
        </p>
        <p className="text-slate-900 font-bold uppercase">
          One love, One future
        </p>
      </footer>
    </div>
  );
};

export default App;
