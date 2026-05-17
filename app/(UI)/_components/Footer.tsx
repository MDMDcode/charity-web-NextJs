import React from 'react';
import { FaPhoneAlt, FaFacebookSquare, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaTiktok, FaLinkedinIn, FaYoutube, FaInstagram } from 'react-icons/fa';

const API = "https://api-shamel.tmt3.sa/api/v1";

async function getSettings() {
  try {
    const res = await fetch(`${API}/settings`, { next: { revalidate: 60 } });
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

const Footer = async () => {
  const settings = await getSettings();

  return (
    <footer className="w-full text-white" dir="rtl">
      <div className="bg-[#1c3d3b] py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold mb-2">نبذة عنا</h3>
            <p className="text-sm leading-relaxed text-emerald-50 opacity-90">
              {settings?.site_description || 'مؤسسة وطنية رائدة'}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold mb-2">الروابط السريعة</h3>
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="text-xl font-bold mb-2">إتصل بنا</h3>
            {settings?.contact?.phone && (
              <div className="flex items-center gap-2">
                <FaPhoneAlt size={16} />
                <span>{settings.contact.phone}</span>
              </div>
            )}
            {settings?.contact?.email && (
              <div className="flex items-center gap-2">
                <FaEnvelope size={16} />
                <span>{settings.contact.email}</span>
              </div>
            )}
            {settings?.contact?.whatsapp && (
              <div className="flex items-center gap-2">
                <FaWhatsapp size={16} />
                <span>{settings.contact.whatsapp}</span>
              </div>
            )}
            {settings?.contact?.address && (
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt size={16} />
                <span>{settings.contact.address}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="text-xl font-bold mb-2">تجدنا على</h3>
            <div className="flex flex-wrap gap-2.5">
              {settings?.social_media?.facebook && <a href={settings.social_media.facebook}><FaFacebookSquare size={28} /></a>}
              {settings?.social_media?.instagram && <a href={settings.social_media.instagram}><FaInstagram size={28} /></a>}
              {settings?.social_media?.whatsapp && <a href={settings.social_media.whatsapp}><FaWhatsapp size={28} /></a>}
              {settings?.social_media?.tiktok && <a href={settings.social_media.tiktok}><FaTiktok size={28} /></a>}
              {settings?.social_media?.linkedin && <a href={settings.social_media.linkedin}><FaLinkedinIn size={28} /></a>}
              {settings?.social_media?.youtube && <a href={settings.social_media.youtube}><FaYoutube size={28} /></a>}
            </div>
          </div>

        </div>
      </div>

      <div className="bg-[#121A1B] py-5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <p className="flex-1 text-center font-medium">
            جميع الحقوق محفوظة © {settings?.site_name || 'الجمعية'} 2024
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;