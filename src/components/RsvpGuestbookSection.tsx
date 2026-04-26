import { Send, Sparkles } from 'lucide-react';
import type { Dispatch, FormEvent, SetStateAction } from 'react';

type GuestbookData = {
  name: string;
  message: string;
};

type RsvpData = {
  name: string;
//   email: string;
  message: string;
  attending: 'yes' | 'no' | '';
};

type Message = {
  id: string;
  name: string;
  message: string;
  date: string;
};

type Props = {
  rsvpData: RsvpData;
  setRsvpData: Dispatch<SetStateAction<RsvpData>>;
  rsvpSubmitted: boolean;
  rsvpFeedback: string | null;
  onRsvpSubmit: (event: FormEvent<HTMLFormElement>) => void;
  guestbookData: GuestbookData;
  setGuestbookData: Dispatch<SetStateAction<GuestbookData>>;
  isGeneratingWish: boolean;
//   generateWishWithAI: () => Promise<void>;
//   addGuestbookMessage: () => void;
  messages: Message[];
};

const RsvpGuestbookSection = ({
  rsvpData,
  setRsvpData,
  rsvpSubmitted,
  rsvpFeedback,
  onRsvpSubmit,
  guestbookData,
  setGuestbookData,
  isGeneratingWish,
//   generateWishWithAI,
//   addGuestbookMessage,
  messages,
}: Props) => {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-12">
        <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
          <h3 className="text-2xl font-bold mb-6">Đăng ký tham dự</h3>
          <form className="space-y-4" onSubmit={onRsvpSubmit}>
            <input
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:border-red-500 bg-white"
              placeholder="Họ và tên của bạn"
              value={rsvpData.name}
              onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
            />
            {/* <input
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:border-red-500 bg-white"
              placeholder="Email của bạn"
              value={rsvpData.email}
              onChange={(e) => setRsvpData({ ...rsvpData, email: e.target.value })}
            /> */}
            <textarea
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:border-red-500 bg-white resize-none"
              rows={4}
              placeholder="Lời nhắn của bạn cho Dương"
              value={rsvpData.message}
              onChange={(e) => setRsvpData({ ...rsvpData, message: e.target.value })}
            />
            <select
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:border-red-500 bg-white"
              value={rsvpData.attending}
              onChange={(e) => setRsvpData({ ...rsvpData, attending: e.target.value as 'yes' | 'no' | '' })}
            >
              <option value="" disabled>
                Bạn sẽ đến cùng mình chứ
              </option>
              <option value="yes">Chắc chắn tham dự</option>
              <option value="no">Rất tiếc, mình bận</option>
            </select>
            <button
              type="submit"
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-red-600 transition-colors shadow-lg"
            >
              GỬI THÔNG TIN
            </button>
          </form>
          {rsvpFeedback && (
            <p className={`mt-4 text-sm ${rsvpSubmitted ? 'text-green-600' : 'text-red-600'}`}>{rsvpFeedback}</p>
          )}
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900">Recently message</h3>
              <p className="text-sm text-slate-500">Anonymous candidates share their message. The avatar is the first character of their first name.</p>
            </div>
            {messages.map((message) => {
              const firstName = message.name ? message.name.split(' ')[0] : 'Anonymous';
              const avatar = firstName.charAt(0).toUpperCase() || 'A';
              const maskedName = firstName
                ? `${firstName.charAt(0).toUpperCase()}${'*'.repeat(Math.max(firstName.length - 1, 0))}`
                : 'A';

              return (
                <div key={message.id} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-start space-x-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400">{avatar}</div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold text-slate-800">{maskedName}</span>
                      <span className="text-[10px] text-slate-400 uppercase">{message.date}</span>
                    </div>
                    <p className="text-sm text-slate-500 italic">"{message.message}"</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RsvpGuestbookSection;
