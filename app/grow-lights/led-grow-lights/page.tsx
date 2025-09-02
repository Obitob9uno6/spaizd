export default function LEDGrowLightsPage() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/professional-cannabis-grow-room-with-mature-flower.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-white bg-opacity-95 rounded-lg p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-green-800 mb-6">LED Grow Lights</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Discover our premium collection of LED grow lights, engineered for maximum efficiency and optimal plant
              growth. Our LED systems provide full-spectrum lighting that mimics natural sunlight while consuming less
              energy than traditional HPS systems.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">Full Spectrum LEDs</h3>
                <p className="text-gray-700">
                  Advanced LED technology providing optimal light spectrum for all growth stages.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-3">Energy Efficient</h3>
                <p className="text-gray-700">Up to 50% more efficient than traditional lighting systems.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-green-800 mb-4">Featured Products</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Quantum Board LED Systems - 240W to 650W</li>
                <li>• COB LED Grow Lights - High intensity, low heat</li>
                <li>• Strip LED Arrays - Modular and scalable</li>
                <li>• UV/IR Supplemental Lighting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
