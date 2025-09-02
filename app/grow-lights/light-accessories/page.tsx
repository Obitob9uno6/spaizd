export default function LightAccessoriesPage() {
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
          <h1 className="text-4xl font-bold text-yellow-800 mb-6">Light Accessories</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Complete your lighting setup with our comprehensive range of accessories. From reflectors to timers, we
              have everything you need to optimize your grow room lighting system.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">Reflectors</h3>
                <p className="text-gray-700 text-sm">Air-cooled and open reflectors for maximum light distribution.</p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">Ballasts</h3>
                <p className="text-gray-700 text-sm">Digital and magnetic ballasts for all lighting systems.</p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">Timers</h3>
                <p className="text-gray-700 text-sm">Precision timing controls for automated light cycles.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-yellow-800 mb-4">Essential Accessories</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-gray-700">
                  <li>• Wing reflectors and air-cooled hoods</li>
                  <li>• Digital ballasts with dimming</li>
                  <li>• Light movers and hangers</li>
                  <li>• PAR meters and light sensors</li>
                </ul>
                <ul className="space-y-2 text-gray-700">
                  <li>• Timer controllers and relays</li>
                  <li>• Replacement bulbs and tubes</li>
                  <li>• Ducting and ventilation accessories</li>
                  <li>• Safety equipment and surge protectors</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
