import { Clock, MapPin, Navigation, Phone } from "lucide-react";

const LocationSection = () => {
  return (
    <section className="py-12 bg-slate-950 text-white rounded-[3rem] mx-4 shadow-2xl">
      <div className="max-w-5xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-bold leading-tight">
              Sự khởi đầu cho nhiều hành trình mới
            </h2>
            <p className="text-slate-400 text-lg">
              Hẹn gặp anh/chị/bạn vào lúc:
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-600/20 rounded-xl">
                  <Clock className="text-red-600" />
                </div>
                <div className="flex flex-col">
                  <span>09 - 11:59 sáng 09/05/2026</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-600/20 rounded-xl">
                  <MapPin className="text-red-600" />
                </div>
                <span>
                  Đài phun nước, Quảng trường C1 Đại học Bách Khoa Hà Nội
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-600/20 rounded-xl">
                  <Phone className="text-red-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Liên hệ:</span>
                  <span>Cao Dương: 0357023426</span>
                  <span>Minh Quang: 0911348859</span>
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                window.open(
                  "https://www.google.com/maps/search/?api=1&query=Thư+viện+Tạ+Quang+Bửu+Bách+Khoa",
                  "_blank",
                )
              }
              className="px-8 py-4 bg-white text-black font-bold rounded-full flex items-center hover:bg-red-600 hover:text-white transition-colors"
            >
              MỞ BẢN ĐỒ CHỈ ĐƯỜNG <Navigation size={18} className="ml-2" />
            </button>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-red-600/20 blur-3xl rounded-full" />
            <div className="relative border border-white/10 rounded-[2rem] overflow-hidden p-2">
              <div className="w-full border-2 bg-slate-900 rounded-[1.5rem] overflow-hidden">
                <img
                  src="assets/map.png"
                  alt="Tạ Quang Bửu location"
                  className="block w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>  
    </section>
  );
};

export default LocationSection;
