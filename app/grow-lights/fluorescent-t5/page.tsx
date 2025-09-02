export default function FluorescentT5Page() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/cannabis-cultivation-workspace-with-design-materia.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-white bg-opacity-95 rounded-lg p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-blue-800 mb-6">Fluorescent T5 Systems</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              T5 fluorescent lighting systems are perfect for seedlings, clones, and vegetative growth. These
              energy-efficient systems provide gentle, even light distribution with minimal heat output.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Low Heat Output</h3>
                <p className="text-gray-700">Cool operation perfect for sensitive seedlings and clones.</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Even Distribution</h3>
                <p className="text-gray-700">Uniform light coverage across the entire growing area.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">T5 Product Line</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 2-foot T5 Systems - Compact propagation</li>
                <li>• 4-foot T5 Systems - Standard vegetative lighting</li>
                <li>• 6500K and 3000K spectrum options</li>
                <li>• High-output T5HO bulbs available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
