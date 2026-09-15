// import { Footer } from "@/modules/layouts/footer";
// import { Navbar } from "@/modules/layouts/navbar";
// import {
//   Facebook,
//   Instagram,
//   Mail,
//   MapPin,
//   Phone,
//   Twitter,
// } from "lucide-react";

// export default function ContactUs() {
//   return (
//     <div>
//       <Navbar />

//       <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
//         {/* Light Floating Blobs */}
//         <div className="absolute w-72 h-72 bg-blue-200/40 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
//         <div className="absolute w-96 h-96 bg-pink-200/40 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

//         <div className="relative z-10 max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-8 text-gray-800">
//           {/* Left Info Section */}
//           <div className="flex flex-col justify-center space-y-6">
//             <h1 className="text-4xl font-bold text-gray-900">Get in Touch</h1>
//             <p className="text-lg text-gray-600">
//               Have questions or feedback? We’d love to hear from you. Fill out
//               the form or reach us through the following channels.
//             </p>

//             <div className="space-y-4">
//               <div className="flex items-center space-x-4">
//                 <Mail className="w-6 h-6 text-blue-600" />
//                 <span>support@example.com</span>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <Phone className="w-6 h-6 text-blue-600" />
//                 <span>+94 71 234 5678</span>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <MapPin className="w-6 h-6 text-blue-600" />
//                 <span>Colombo, Sri Lanka</span>
//               </div>
//             </div>

//             {/* Social Links */}
//             <div className="flex space-x-6 mt-6">
//               <Facebook className="w-6 h-6 text-gray-600 hover:text-blue-600 transition" />
//               <Instagram className="w-6 h-6 text-gray-600 hover:text-pink-500 transition" />
//               <Twitter className="w-6 h-6 text-gray-600 hover:text-sky-500 transition" />
//             </div>
//           </div>

//           {/* Right Form Section */}
//           <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
//             <form className="space-y-6">
//               <div>
//                 <label className="block mb-2 font-medium">Name</label>
//                 <input
//                   type="text"
//                   className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:border-blue-400 focus:ring focus:ring-blue-200/50"
//                 />
//               </div>

//               <div>
//                 <label className="block mb-2 font-medium">Email</label>
//                 <input
//                   type="email"
//                   className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:border-blue-400 focus:ring focus:ring-blue-200/50"
//                 />
//               </div>

//               <div>
//                 <label className="block mb-2 font-medium">Message</label>
//                 <textarea
//                   rows={4}
//                   className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:border-blue-400 focus:ring focus:ring-blue-200/50"
//                 ></textarea>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold text-white transition"
//               >
//                 Send Message
//               </button>
//             </form>
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </div>
//   );
// }

"use client";

import {
  Calendar,
  Facebook,
  Headphones,
  Instagram,
  Linkedin,
  Shield,
  Twitter,
} from "lucide-react";

import { Footer } from "@/modules/layouts/footer";
import { Navbar } from "@/modules/layouts/navbar";

export default function ContactUs() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Contact Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
              {/* Address */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  Address
                </h3>
                <p className="text-gray-800 font-medium">Colombo, Sri Lanka</p>
              </div>

              {/* Toll Free Customer Care */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  Toll Free Customer Care
                </h3>
                <p className="text-gray-800 font-medium">+94 712 568 568</p>
              </div>

              {/* Need live support? */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  Need live support?
                </h3>
                <p className="text-gray-800 font-medium"> info@bloonsoo.com </p>
              </div>

              {/* Follow us on social media */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  Follow us on social media
                </h3>
                <div className="flex space-x-3">
                  <Facebook className="w-5 h-5 text-blue-600 hover:text-blue-700 cursor-pointer transition" />
                  <Twitter className="w-5 h-5 text-sky-500 hover:text-sky-600 cursor-pointer transition" />
                  <Instagram className="w-5 h-5 text-pink-500 hover:text-pink-600 cursor-pointer transition" />
                  <Linkedin className="w-5 h-5 text-blue-700 hover:text-blue-800 cursor-pointer transition" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 px-4 bg-purple-50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600 mb-12">
              These popular destinations have a lot to offer
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Best Price Guarantee */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Best Price Guarantee
                </h3>
                <p className="text-gray-600">
                  Get the best deals with our unbeatable price guarantee.
                </p>
              </div>

              {/* Easy & Quick Booking */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Easy & Quick Booking
                </h3>
                <p className="text-gray-600">
                  Book effortlessly in just a few clicks.
                </p>
              </div>

              {/* Customer Care 24/7 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Customer Care 24/7
                </h3>
                <p className="text-gray-600">
                  We're here to help anytime, day or night.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
