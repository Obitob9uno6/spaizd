export default function HPSSystemsPage() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/professional-indoor-cannabis-cultivation-facility-.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-white bg-opacity-95 rounded-lg p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-orange-800 mb-6">HPS Lighting Systems</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              High Pressure Sodium (HPS) lighting systems remain the gold standard for professional cultivation. Our HPS
              systems deliver intense, penetrating light that promotes exceptional flowering and yields.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-orange-800 mb-3">Proven Performance</h3>
                <p className="text-gray-700">
                  Decades of proven results in commercial cultivation facilities worldwide.
                </p>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-orange-800 mb-3">Deep Penetration</h3>
                <p className="text-gray-700">Superior light penetration through dense canopies for maximum yields.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-orange-800 mb-4">HPS Product Range</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 400W HPS Systems - Perfect for small grows</li>
                <li>• 600W HPS Systems - Industry standard</li>
                <li>• 1000W HPS Systems - Maximum power</li>
                <li>• Double-Ended HPS - Enhanced efficiency</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
