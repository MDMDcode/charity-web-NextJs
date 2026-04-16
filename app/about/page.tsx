'use client'

import axios from "axios";
import { useEffect, useState } from "react";
import apiClient from "../lib/api";

 export default function AlSabrPage() {

  interface About {
    id: string 
    title: string 
    subtitle:string 
    our_massage:string
    our_vision:string
    our_goals:string
    our_values: string
  }

  const [form , setForm] = useState<About[]>([])

  useEffect( function(){
    async function fetchData() {
      try{
        const res = await apiClient.get("about" , {
        headers : {Accept: "application/json"}
      })
      setForm(res.data.data.data)
      } catch{}
    }
    fetchData()
  } , [])
 
  return (
    <main className="min-h-screen bg-[#eaf1f1]" style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}>

      {form.map(function(item) {
        return (
          <div key={item.id}>
        <section  className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 px-8 md:px-20 py-16 bg-[#f0f4f4]">

        <div className="w-full md:w-[420px] shrink-0 rounded-2xl overflow-hidden shadow-xl h-80 bg-[#2a6b6b] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a6b6b]/90 to-[#1d4f4f]/80" />
          {/* <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"> */}
            {/* <div className="w-20 h-20 border-2 border-white/60 rounded-t-full rounded-b-lg flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-white/50 rounded-t-full" />
            </div>
            <p className="text-white/90 text-sm font-bold">جمعية تمتع الخيرية</p>
            <p className="text-white/60 text-xs">TMT3</p>
          </div> */}
        </div>

        {/* النص */}
        <div className="flex-1 text-right space-y-5 max-w-xl">
          <h2 className="text-5xl font-black text-[#2a8c7a]">{item.title}</h2>
          <p className="text-gray-600 leading-relaxed text-base">{item.subtitle}</p>

          <div dir="rtl" className="flex gap-3 flex-wrap pt-2">
            <a href="store" className="bg-[#2a8c7a] text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#22756a] transition-colors">
               برامجنا وخدماتنا
            </a>
            <a href="contact" className="border border-[#2a8c7a] text-[#2a8c7a] px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#2a8c7a]/10 transition-colors">
               تواصل معنا
            </a>
          </div>
        </div>
      </section>

      {/* ========== رؤية / رسالة / قيم ========== */}
      <section className="px-8 md:px-20 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* قيمنا */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#2a8c7a] text-right">
            <div className="flex justify-end mb-4">
              <span className="w-14 h-14 rounded-xl bg-[#2a8c7a] flex items-center justify-center text-white text-2xl"></span>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">قيمنا</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{item.our_values}</p>
          </div>

          {/* رسالتنا */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#2a8c7a] text-right">
            <div className="flex justify-end mb-4">
              <span className="w-14 h-14 rounded-xl bg-[#2a8c7a] flex items-center justify-center text-white text-2xl"></span>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">رسالتنا</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{item.our_massage}</p>
          </div>

          {/* رؤيتنا */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-[#2a8c7a] text-right">
            <div className="flex justify-end mb-4">
              <span className="w-14 h-14 rounded-xl bg-[#2a8c7a] flex items-center justify-center text-white text-2xl"> </span>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">رؤيتنا</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{item.our_vision}</p>
          </div>

        </div>
      </section>

      {/* ========== أهدافنا ========== */}
      <section id="programs" className="px-8 md:px-20 pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">

          <div className="flex items-center justify-end gap-3 mb-10">
            <h2 className="text-2xl font-black text-gray-900">أهدافنا</h2>
            <span className="w-12 h-12 rounded-xl bg-[#2a8c7a] flex items-center justify-center text-white text-xl"></span>
          </div>

          <div className="space-y-5 text-right">

            <div className="flex items-start gap-4 border-b border-gray-100 pb-5">
              <p className="flex-1 text-gray-700 text-sm leading-relaxed">{item.our_goals}</p>
              <span className="w-8 h-8 shrink-0 rounded-full bg-[#2a8c7a]/10 text-[#2a8c7a] font-black text-sm flex items-center justify-center">1</span>
            </div>

          </div>
        </div>
      </section>
          </div>

        )
      })}

     
    </main>
  );
}