import React, { useState } from 'react';
import { MessageCircle, Instagram, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // ในอนาคตสามารถเชื่อม API / Google Apps Script ส่งเข้า LINE ตรงนี้ได้
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto text-slate-800">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-rose-400 bg-clip-text text-transparent mb-4">
          Contact Us
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          มีคำถาม สอบถามเรื่องทรงขนตา หรือต้องการคำแนะนำเพิ่มเติม? ติดต่อทีมงาน VyLash ได้ตลอดเวลาค่ะ
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left Side: Contact Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">ช่องทางการติดต่อด่วน</h2>

          {/* LINE Official Card */}
          <a
            href="https://line.me/R/ti/p/@974xmrmn"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-pink-100 shadow-sm hover:shadow-md transition-all flex items-center gap-5 group hover:-translate-y-0.5"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl font-bold shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <MessageCircle size={28} />
            </div>
            <div>
              <div className="text-sm text-slate-500 font-medium">LINE Official Account</div>
              <div className="text-lg font-bold text-slate-800">@974xmrmn</div>
              <div className="text-xs text-emerald-600 mt-1 font-medium">● แชตพูดคุย/สั่งซื้อด่วน ตอบไวที่สุด</div>
            </div>
          </a>

          {/* Instagram Card */}
          <a
            href="https://www.instagram.com/vylash.official?stkn=MnVvYWl4cmNtc3Y4"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-pink-100 shadow-sm hover:shadow-md transition-all flex items-center gap-5 group hover:-translate-y-0.5"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <Instagram size={28} />
            </div>
            <div>
              <div className="text-sm text-slate-500 font-medium">Instagram</div>
              <div className="text-lg font-bold text-slate-800">@vylash.official</div>
              <div className="text-xs text-rose-500 mt-1 font-medium">ดูรีวิวและอัปเดตเทรนด์ขนตาใหม่ๆ</div>
            </div>
          </a>

          {/* Business Info Card */}
          <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-md border border-slate-100 space-y-4 text-slate-600">
            <div className="flex items-center gap-3">
              <Clock className="text-pink-500" size={20} />
              <span><strong>เวลาทำการ:</strong> จันทร์ - เสาร์ (09:00 - 20:00 น.)</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-pink-500" size={20} />
              <span><strong>Email:</strong> support@vylash.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-pink-500" size={20} />
              <span><strong>Call Center:</strong> 080-000-0000</span>
            </div>
          </div>
        </div>

        {/* Right Side: Send Message Form */}
        <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-pink-100 shadow-lg relative">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">ฝากข้อความถึงเรา</h2>

          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle size={56} className="text-emerald-500 mx-auto animate-bounce" />
              <h3 className="text-2xl font-bold text-slate-800">ขอบคุณสำหรับข้อความค่ะ!</h3>
              <p className="text-slate-600">ทีมงานได้รับข้อความเรียบร้อยแล้ว จะติดต่อกลับโดยเร็วที่สุดนะคะ</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-full bg-pink-100 text-pink-600 font-medium hover:bg-pink-200 transition-colors"
              >
                ส่งข้อความอื่นเพิ่ม
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="เช่น คุณสมหญิง แต่งสวย"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/90"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">เบอร์โทรศัพท์ *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08X-XXX-XXXX"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">อีเมล</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="yourname@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/90"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ข้อความ / คำถาม *</label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="สอบถามข้อมูล หรือรายละเอียดเพิ่มเติม..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/90 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold shadow-md hover:shadow-lg hover:brightness-105 transition-all flex items-center justify-center gap-2"
              >
                <Send size={18} />
                ส่งข้อความหาเรา
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
