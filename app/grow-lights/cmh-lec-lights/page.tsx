export default function CMHLECLightsPage() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/empty-indoor-cannabis-grow-tent-with-led-lights-an.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-white bg-opacity-95 rounded-lg p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-purple-800 mb-6">CMH/LEC Lighting</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Ceramic Metal Halide (CMH) and Light Emitting Ceramic (LEC) technology represents the perfect balance
              between efficiency and spectrum quality. These systems produce exceptional terpene profiles and resin
              production.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">Full Spectrum</h3>
                <p className="text-gray-700">Natural sunlight spectrum including UV and IR for enhanced quality.</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-800 mb-3">Enhanced Terpenes</h3>
                <p className="text-gray-700">UV spectrum promotes increased terpene and cannabinoid production.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-800 mb-4">CMH/LEC Options</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 315W CMH Systems - Efficient and effective</li>
                <li>• 630W Double-Ended CMH - Professional grade</li>
                <li>• Full spectrum 3100K and 4200K bulbs</li>
                <li>• Low frequency square wave ballasts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
