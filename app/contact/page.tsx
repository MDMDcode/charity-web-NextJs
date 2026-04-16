'use client'
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react'
import apiClient from "../lib/api";

const Contact = () => {

 const [Form , setForm] = useState({
  name: "" ,
  email: "" ,
  phone: "" ,
  massage_type: "" ,
  massage: ""
 })

 function handleInputChange(e : React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement > ){
  setForm({
    ...Form,
    [e.target.name] : e.target.value
  })
 }

 const handleForm = async function(e : React.SubmitEvent) {
  e.preventDefault()
    const res = await apiClient.post("contact" , Form ,  { 
    headers : {
      Accept : "application/json" ,
      "Content-Type" : "application/json"
    },

  }
  ) 

 }
 
  
//  async function  sendMassage(data : any){
//   const res = await axios.post("http://127.0.0.1:8000/api/v1/contact" , data ,  { 
//     headers : {
//       Accept : "application/json" ,
//       "Content-Type" : "application/json"
//     }
//   }
//   ) 
//    console.log(res , "done")

//  }

  return (
    <div dir='rtl' className='px-6 py-4 bg-gray-50/50 min-h-screen text-right font-sans'>

      {/* Breadcrumb - مسار الصفحة */}
      <div className='w-full flex items-center gap-2 py-4 text-sm text-gray-500'>
        <Link href='/' className='flex items-center gap-1 text-gray-500 hover:text-teal-600'>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
          <span>الرئيسية</span>
        </Link>
        <span className="text-gray-400">❮</span>
        <span className='text-teal-600 font-medium'>تواصل معنا</span>
      </div>

      {/* Header - الهيدر الأخضر الخفيف */}
      <div className='flex items-center gap-4 bg-teal-50 rounded-xl px-6 py-6 mb-8'>
        <div className='bg-teal-500 text-white p-4 rounded-xl shadow-sm'>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
        </div>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>تواصل معنا</h1>
          <p className='text-teal-600 text-sm mt-1 font-medium'>نسعد بتواصلك معنا</p>
        </div>
      </div>

      {/* <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10'>
        
        <div className='flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm'>
            <div className='bg-teal-500 p-3 rounded-xl flex-shrink-0 text-white'>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            </div>
            <div>
              <p className='font-bold text-gray-800 text-sm'>اتصل بنا</p>
              <p className='text-gray-400 text-xs mt-1'>0555788186</p>
            </div>
        </div>

        <div className='flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm'>
            <div className='bg-blue-500 p-3 rounded-xl flex-shrink-0 text-white'>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <p className='font-bold text-gray-800 text-sm'>البريد الإلكتروني</p>
              <p className='text-gray-400 text-xs mt-1'>info@tmt3.sa</p>
            </div>
        </div>

        <div className='flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm'>
            <div className='bg-teal-500 p-3 rounded-xl flex-shrink-0 text-white'>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <div>
              <p className='font-bold text-gray-800 text-sm'>العنوان</p>
              <p className='text-gray-400 text-xs mt-1'>محافظة مكة</p>
            </div>
        </div>

        <div className='flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm'>
            <div className='bg-orange-400 p-3 rounded-xl flex-shrink-0 text-white'>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <p className='font-bold text-gray-800 text-sm'>أوقات العمل</p>
              <p className='text-gray-400 text-xs mt-1'>غير محدد</p>
            </div>
        </div>

      </div> */}

      {/* نموذج المراسلة والخريطة */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        
        {/* نموذج المراسلة */}
        <div className='lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100'>
          <h2 className='text-xl font-bold text-teal-600 mb-6'>أرسل لنا رسالة</h2>
          
          <form className='space-y-5' onSubmit={handleForm}>
            <div className='space-y-1 text-right'>
              <label className='text-sm text-gray-600 mr-1'>الاسم الكامل *</label>
              <input onChange={handleInputChange} name='name' type='text' className='w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-teal-500 transition-all text-gray-800' />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-1 text-right'>
                <label className='text-sm text-gray-600 mr-1'>البريد الإلكتروني *</label>
                <input onChange={handleInputChange} name='email' type='email' className='w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-teal-500 text-gray-800' />
              </div>
              <div className='space-y-1 text-right'>
                <label className='text-sm text-gray-600 mr-1'>رقم الجوال *</label>
                <input onChange={handleInputChange} name='phone' type='tel' className='w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-teal-500 text-gray-800' />
              </div>
            </div>

            <div  className='space-y-1 text-right'>
              <label className='text-sm text-gray-600 mr-1'>نوع الرسالة *</label>
              <select  name='massage_type' onChange={handleInputChange} className='w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none text-gray-500 appearance-none cursor-pointer'>
                <option value="inquiry">استفسار</option>
                <option value="complaint">شكوى</option>
                <option value="other">أخرى</option>
              </select>
            </div>

            <div className='space-y-1 text-right'>
              <label className='text-sm text-gray-600 mr-1'>الرسالة *</label>
              <textarea onChange={handleInputChange} name='massage' rows={4} className='w-full bg-gray-50 border border-gray-100 rounded-xl p-3 outline-none focus:border-teal-500 resize-none text-gray-800'></textarea>
            </div>

            <button type='submit' className='w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-teal-100'>
              <span>إرسال الرسالة</span>
              <svg className="w-4 h-4 -rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
            </button>
          </form>
        </div>

        {/* العمود الجانبي */}
        <div className='flex flex-col gap-6 text-right'>
          
          {/* الخريطة */}
          <div className='h-52 bg-gray-100 rounded-3xl relative overflow-hidden border border-gray-100 shadow-inner'>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d475331.442938367!2d39.7570889!3d21.435345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c21b4ced818775%3A0x98fba51ea654820d!2sMakkah!5e0!3m2!1sen!2ssa!4v1650000000000!5m2!1sen!2ssa"
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
            ></iframe>
            <div className='absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100 z-10'>
               <div className='bg-black text-white p-2 rounded-xl'>
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"></path></svg>
               </div>
               <div className='text-[11px] leading-tight'>
                  <p className='font-bold text-gray-900'>موقعنا</p>
                  <p className='text-gray-500'>محافظة بحرة</p>
               </div>
            </div>
          </div>

          {/* وسائل التواصل */}
          {/* <div className='bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-start'>
            <span className='text-teal-600 font-bold mb-4 text-sm'>تابعنا على</span>
            <div className='flex gap-3'>
               <div className='w-11 h-11 bg-gray-50 hover:bg-teal-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-teal-600 transition-all cursor-pointer shadow-sm'>
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
               </div>
               <div className='w-11 h-11 bg-gray-50 hover:bg-teal-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-teal-600 transition-all cursor-pointer shadow-sm'>
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
               </div>
            </div>
          </div> */}

          {/* بطاقة المساعدة */}
          <div className='bg-teal-600 p-8 rounded-3xl text-white shadow-lg shadow-teal-100 relative overflow-hidden'>
            <div className='relative z-10'>
              <h3 className='text-xl font-bold mb-1'>هل تريد المساعدة؟</h3>
              <p className='text-teal-100 text-xs mb-6 font-medium'>فريقنا جاهز للإجابة على جميع استفساراتك</p>
              <div className='space-y-3'>
                <div className='bg-white/10 p-3 rounded-xl flex justify-between items-center border border-white/5'>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.516 5.516l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C10.12 18 2 9.879 2 2V3z"></path></svg>
                    <span dir='ltr' className='font-medium'>0511111111</span>
                </div>
                <div className='bg-white/10 p-3 rounded-xl flex justify-between items-center border border-white/5'>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                    <span className='text-xs font-medium'>info@tmt3</span>
                </div>
              </div>
            </div>
            <div className='absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl'></div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Contact;