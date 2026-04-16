'use client'
import axios from "axios";
import { useEffect, useState } from "react";
import { FaQuoteRight } from "react-icons/fa";

const API_BASE_URL = 'http://localhost:8000';

const getImageUrl = (path: string | null | undefined): string | null => {
    if (!path) return null;
    return `${API_BASE_URL}/api/v1/news-image?path=${path.replace('/storage', '')}`;
};

export default function Testimonial({ data }: { data?: any }) {

    const [Testimonials, setTestimonials] = useState<any[]>([]);
    const [current, setcurrent] = useState(0);

    useEffect(function () {
        const getTestimonials = async function () {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/v1/testimonials`);
                setTestimonials(res.data.data);
            } catch (error) {
                console.log(error, "wrong");
            }
        }
        getTestimonials();
    }, [])

    function goNext() {
        setcurrent((current + 1) % Testimonials.length);
    }

    function goPrev() {
        setcurrent((current - 1 + Testimonials.length) % Testimonials.length);
    }

    const avatarUrl =
        getImageUrl(Testimonials[current]?.avatar?.thumb) ||
        getImageUrl(Testimonials[current]?.avatar?.original);

    if (Testimonials.length === 0) return null;

    return (
        <div className="w-full bg-gradient-to-br from-slate-50 via-blue-100 to-indigo-100 py-16">
            <div dir="rtl" className="flex w-full items-center justify-between px-20">

                <div className="w-[25%] flex flex-col items-center text-center gap-4">
                    <h2 className="text-black text-3xl font-bold">
                        {data?.title}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {data?.subtitle }
                    </p>
                    <button className="text-white cursor-pointer px-5 py-2 bg-[#009689] shadow-lg rounded-lg text-sm font-bold hover:bg-[#007a6e] transition-colors">
                        عرض كافة التزكيات
                    </button>
                </div>

                <div className="w-[68%] bg-[#F5F5F5] rounded-3xl shadow-xl relative pt-16 pb-6">

                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        {avatarUrl ? (
                            <img
                                className="w-24 h-24 shadow-lg rounded-full border-4 border-white object-cover"
                                src={avatarUrl}
                                alt={Testimonials[current]?.name}
                            />
                        ) : (
                            <div className="w-24 h-24 shadow-lg rounded-full border-4 border-white bg-[#009689] flex items-center justify-center">
                                <span className="text-white text-3xl font-bold">
                                    {Testimonials[current]?.name?.charAt(0) || '؟'}
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={goPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/20 hover:bg-black/30 text-black rounded-full flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    <button
                        onClick={goNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/20 hover:bg-black/30 text-black rounded-full flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>

                    <div className="px-16 space-y-3">
                        <FaQuoteRight size={28} className="text-black/20" />
                        <p className="text-black font-bold text-xl">{Testimonials[current]?.name}</p>
                        <p className="text-black/60 text-sm">{Testimonials[current]?.role}</p>
                        <p className="text-black/80 text-sm leading-relaxed">{Testimonials[current]?.content}</p>
                    </div>

                    <div className="flex gap-2 justify-center mt-6">
                        {Testimonials.map(function (item: any, index: number) {
                            return (
                                <div
                                    key={index}
                                    onClick={function () { setcurrent(index) }}
                                    className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                                        index === current ? "bg-black w-6" : "bg-white/30 w-2"
                                    }`}
                                />
                            )
                        })}
                    </div>

                </div>

            </div>
        </div>
    );
}