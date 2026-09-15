export function DownloadApp() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Content */}
          <div className="lg:w-1/2 text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Get our app
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Book your perfect stay on the go. Download our app for exclusive
              deals, easy booking, and instant confirmations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#"
                className="flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105"
              >
                <img
                  src="/assets/apple.png"
                  alt="App Store"
                  className="w-30 h-10 rounded-lg"
                />
                <div>
                  <div className="text-xs text-blue-200">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105"
              >
                <img
                  src="/assets/android.png"
                  alt="Google Play"
                  className="w-30 h-10 rounded-lg"
                />
                <div>
                  <div className="text-xs text-blue-200">Get it on</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-64 h-96 bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-2">
                <div className="w-full h-full bg-gradient-to-b from-blue-50 to-white rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300&h=400&fit=crop"
                    alt="App Screenshot"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full opacity-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
