"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const GrowRoomEntrance = () => {
  const router = useRouter()
  const [doorsOpen, setDoorsOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [lightsOn, setLightsOn] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showComingSoon, setShowComingSoon] = useState(false)

  useEffect(() => {
    const sequence = async () => {
      setTimeout(() => setIsLoading(false), 800)
      setTimeout(() => setPageLoaded(true), 1000)
      setTimeout(() => setLightsOn(true), 1500)
      setTimeout(() => setDoorsOpen(true), 2000)

      setTimeout(() => {
        let currentZoom = 1
        const zoomInterval = setInterval(() => {
          currentZoom += 0.002
          setZoomLevel(currentZoom)
          if (currentZoom >= 1.2) {
            clearInterval(zoomInterval)
          }
        }, 80)
      }, 4000)
    }

    sequence()
  }, [])

  const NavigationLight = ({ label, delay = 0, isOn, menuItems = [], href = "/" }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [cordPulled, setCordPulled] = useState(false)
    const [warmupPhase, setWarmupPhase] = useState(0)

    useEffect(() => {
      if (isOn) {
        setTimeout(() => setWarmupPhase(1), delay * 1000)
        setTimeout(() => setWarmupPhase(2), delay * 1000 + 800)
        setTimeout(() => setWarmupPhase(3), delay * 1000 + 1600)
        setTimeout(() => setWarmupPhase(4), delay * 1000 + 2400)
        setTimeout(() => setWarmupPhase(5), delay * 1000 + 3200) // Full intensity
      }
    }, [isOn, delay])

    const toggleDropdown = () => {
      setCordPulled(true)
      setTimeout(() => setCordPulled(false), 200)
      setShowDropdown(!showDropdown)
    }

    const handleNavigation = (item: string) => {
      let path = "/"
      if (label === "Products") path = "/shop"
      else if (label === "Solutions") path = "/solutions"
      else if (label === "Support") path = "/support"
      else if (label === "About") path = "/about"
      else if (label === "Contact") path = "/contact"
      else if (label === "Lighting Solutions") path = "/lighting"
      else if (label === "Get Quote") path = "/quote"

      router.push(path)
      setShowDropdown(false)
    }

    const getLightIntensity = () => {
      switch (warmupPhase) {
        case 0:
          return 0
        case 1:
          return 25
        case 2:
          return 50
        case 3:
          return 75
        case 4:
          return 90
        case 5:
          return 100
        default:
          return 0
      }
    }

    return (
      <div className="relative" style={{ width: "180px" }}>
        {/* Suspension cables */}
        <div className="flex justify-center mb-2">
          <div className="flex space-x-8">
            <div
              style={{
                width: "2px",
                height: "30px",
                background: "linear-gradient(to bottom, #666666, #444444)",
                boxShadow: "1px 0 2px rgba(0,0,0,0.3)",
              }}
            />
            <div
              style={{
                width: "2px",
                height: "30px",
                background: "linear-gradient(to bottom, #666666, #444444)",
                boxShadow: "1px 0 2px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </div>

        {/* Professional grow light fixture - rectangular reflector hood */}
        <div className="relative" style={{ width: "180px", height: "80px" }}>
          {/* Ballast unit (left side) */}
          <div
            className="absolute left-0 top-0 rounded-sm"
            style={{
              width: "35px",
              height: "80px",
              background: "linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 25%, #c8c8c8 50%, #b8b8b8 75%, #a8a8a8 100%)",
              boxShadow: "inset -2px 0 4px rgba(0,0,0,0.2), 2px 0 8px rgba(0,0,0,0.3)",
              border: "1px solid #999999",
            }}
          >
            {/* Power indicator LED */}
            <div
              className="absolute top-2 left-1/2 transform -translate-x-1/2 rounded-full transition-all duration-500"
              style={{
                width: "6px",
                height: "6px",
                background: warmupPhase > 0 ? "#00ff00" : "#333333",
                boxShadow: warmupPhase > 0 ? "0 0 8px #00ff00" : "none",
              }}
            />
            {/* Ventilation grilles */}
            <div className="absolute bottom-2 left-1 right-1 space-y-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: "1px",
                    background: "linear-gradient(to right, transparent, #666666, transparent)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Main reflector hood */}
          <div
            className="absolute left-8 top-0 rounded-lg"
            style={{
              width: "140px",
              height: "80px",
              background:
                "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 15%, #d8d8d8 30%, #e0e0e0 45%, #d5d5d5 60%, #c8c8c8 75%, #b8b8b8 90%, #a8a8a8 100%)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)",
              border: "1px solid #aaaaaa",
            }}
          >
            {/* Hammered metal texture pattern */}
            <div
              className="absolute inset-2 rounded"
              style={{
                background: `
                  radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 1px, transparent 1px),
                  radial-gradient(circle at 60% 20%, rgba(0,0,0,0.1) 1px, transparent 1px),
                  radial-gradient(circle at 80% 60%, rgba(255,255,255,0.3) 1px, transparent 1px),
                  radial-gradient(circle at 30% 80%, rgba(0,0,0,0.1) 1px, transparent 1px),
                  radial-gradient(circle at 70% 40%, rgba(255,255,255,0.2) 1px, transparent 1px)
                `,
                backgroundSize: "15px 15px, 12px 12px, 18px 18px, 14px 14px, 16px 16px",
              }}
            />

            {/* Double-ended lamp tube */}
            <div
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000"
              style={{
                width: "120px",
                height: "12px",
                background:
                  warmupPhase > 0
                    ? `linear-gradient(90deg, 
                      rgba(255,230,150,${getLightIntensity() / 100}) 0%, 
                      rgba(255,215,0,${getLightIntensity() / 80}) 20%, 
                      rgba(255,200,50,${getLightIntensity() / 70}) 50%, 
                      rgba(255,215,0,${getLightIntensity() / 80}) 80%, 
                      rgba(255,230,150,${getLightIntensity() / 100}) 100%)`
                    : "linear-gradient(90deg, #666666 0%, #888888 50%, #666666 100%)",
                boxShadow:
                  warmupPhase > 0
                    ? `0 0 ${warmupPhase * 12}px rgba(255,215,0,0.8), inset 0 2px 4px rgba(255,255,255,0.3)`
                    : "inset 0 1px 2px rgba(0,0,0,0.3)",
                border: "1px solid #999999",
              }}
            >
              {/* Lamp end caps */}
              <div
                className="absolute left-0 top-1/2 transform -translate-y-1/2 rounded-full"
                style={{
                  width: "8px",
                  height: "8px",
                  background: "radial-gradient(circle, #cccccc, #999999)",
                  border: "1px solid #777777",
                }}
              />
              <div
                className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-full"
                style={{
                  width: "8px",
                  height: "8px",
                  background: "radial-gradient(circle, #cccccc, #999999)",
                  border: "1px solid #777777",
                }}
              />
            </div>

            {/* Wattage label */}
            <div
              className="absolute bottom-1 right-2 text-xs font-bold"
              style={{
                color: warmupPhase > 2 ? "#8B4513" : "#666666",
                fontSize: "10px",
                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              1000W DE
            </div>
          </div>
        </div>

        {/* Pull cord chain */}
        <div className="flex flex-col items-center mt-2">
          <div
            style={{
              width: "2px",
              height: cordPulled ? "15px" : "25px",
              background: "#666666",
              transition: "all 0.2s ease",
            }}
          />
          <button
            onClick={toggleDropdown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="transition-all duration-200"
            style={{
              width: "16px",
              height: "16px",
              background: "radial-gradient(circle, #ffffff 0%, #cccccc 100%)",
              borderRadius: "50%",
              border: "1px solid #999999",
              boxShadow: isHovered ? "0 2px 8px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.2)",
              transform: cordPulled ? "translateY(4px)" : isHovered ? "translateY(1px)" : "translateY(0px)",
            }}
          />
        </div>

        {/* Navigation Label */}
        <div
          className="text-center mt-3"
          style={{
            fontSize: "14px",
            color: warmupPhase > 0 ? "#8B4513" : "#666666",
            fontWeight: "bold",
          }}
        >
          {label}
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 rounded-lg shadow-2xl z-50"
            style={{
              width: "200px",
              background: "linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)",
              border: "1px solid #cccccc",
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item)}
                className="block w-full text-left px-4 py-3 text-sm hover:bg-amber-50 hover:text-amber-800 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                style={{ color: "#333333" }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-amber-600">💡</span>
                  <span>{item}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Professional light beam effect */}
        {warmupPhase > 0 && (
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2"
            style={{
              width: `${100 + warmupPhase * 30}px`,
              height: `${60 + warmupPhase * 25}px`,
              background: `radial-gradient(ellipse at center top, 
                rgba(255,230,150,${warmupPhase * 0.15}) 0%, 
                rgba(255,215,0,${warmupPhase * 0.1}) 30%, 
                rgba(255,200,50,${warmupPhase * 0.05}) 60%, 
                transparent 100%)`,
              borderRadius: "0 0 50% 50%",
            }}
          />
        )}

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0px); }
          }
        `}</style>
      </div>
    )
  }

  const ComingSoonModal = () => {
    const [timeLeft, setTimeLeft] = useState({
      days: 7,
      hours: 12,
      minutes: 30,
      seconds: 45,
    })

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 }
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
          } else if (prev.hours > 0) {
            return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
          } else if (prev.days > 0) {
            return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
          }
          return prev
        })
      }, 1000)

      return () => clearInterval(timer)
    }, [])

    if (!showComingSoon) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">🌿 Drops Coming Soon</h2>
          <p className="text-gray-600 mb-6">Our exclusive product drops are launching soon!</p>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{timeLeft.days}</div>
              <div className="text-sm text-gray-500">Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{timeLeft.hours}</div>
              <div className="text-sm text-gray-500">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{timeLeft.minutes}</div>
              <div className="text-sm text-gray-500">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{timeLeft.seconds}</div>
              <div className="text-sm text-gray-500">Seconds</div>
            </div>
          </div>

          <button
            onClick={() => setShowComingSoon(false)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  const LoadingTransition = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-800"
      style={{
        background: "linear-gradient(45deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
        opacity: isLoading ? 1 : 0,
        pointerEvents: isLoading ? "auto" : "none",
      }}
    >
      <div className="text-center">
        <div className="mb-8">
          <div
            className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"
            style={{
              boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)",
            }}
          />
        </div>
        <div className="text-green-400 text-xl font-bold mb-2">Grow Room Initializing...</div>
        <div className="text-green-300 text-sm">Warming up cultivation systems</div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen overflow-hidden relative">
      <LoadingTransition />
      <ComingSoonModal />

      {/* Main room container with zoom effect */}
      <div
        className="min-h-screen transition-all duration-12000 relative"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "center center",
          background: lightsOn
            ? "linear-gradient(to bottom, #fffbf0 0%, #fff8e7 25%, #fdf6e3 50%, #faf3d9 75%, #f5f0cc 100%)"
            : "linear-gradient(to bottom, #0a0a0a 0%, #080808 25%, #060606 50%, #040404 75%, #020202 100%)",
        }}
      >
        {/* Room environment */}
        <div className="absolute inset-0">
          <div
            className="absolute bottom-0 left-0 right-0 h-64 transition-all duration-4000"
            style={{
              background: lightsOn
                ? "linear-gradient(to top, #d4c5a0 0%, rgba(212,197,160,0.8) 30%, transparent 100%)"
                : "linear-gradient(to top, #1a1a1a 0%, rgba(26,26,26,0.8) 30%, transparent 100%)",
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-48 transition-all duration-4000"
            style={{
              background: lightsOn
                ? "linear-gradient(to bottom, #f0f0f0 0%, rgba(240,240,240,0.9) 60%, transparent 100%)"
                : "linear-gradient(to bottom, #2a2a2a 0%, rgba(42,42,42,0.9) 60%, transparent 100%)",
            }}
          />
        </div>

        <div className="fixed inset-0 z-50 pointer-events-none">
          <div
            className="absolute left-0 top-0 w-1/2 h-full transition-all duration-6000 ease-out"
            style={{
              transform: doorsOpen ? "perspective(1000px) rotateY(-120deg)" : "perspective(1000px) rotateY(0deg)",
              transformOrigin: "left center",
              background: "linear-gradient(to right, #ffffff 0%, #f8f8f8 20%, #ffffff 40%, #f5f5f5 60%, #ffffff 100%)",
              boxShadow: doorsOpen
                ? "-40px 0 80px rgba(0,0,0,0.4), inset 20px 0 40px rgba(0,0,0,0.1)"
                : "inset -10px 0 30px rgba(0,0,0,0.1), 0 0 20px rgba(0,0,0,0.1)",
              border: "2px solid #e0e0e0",
            }}
          />
          <div
            className="absolute right-0 top-0 w-1/2 h-full transition-all duration-6000 ease-out"
            style={{
              transform: doorsOpen ? "perspective(1000px) rotateY(120deg)" : "perspective(1000px) rotateY(0deg)",
              transformOrigin: "right center",
              background: "linear-gradient(to left, #ffffff 0%, #f8f8f8 20%, #ffffff 40%, #f5f5f5 60%, #ffffff 100%)",
              boxShadow: doorsOpen
                ? "40px 0 80px rgba(0,0,0,0.4), inset -20px 0 40px rgba(0,0,0,0.1)"
                : "inset 10px 0 30px rgba(0,0,0,0.1), 0 0 20px rgba(0,0,0,0.1)",
              border: "2px solid #e0e0e0",
            }}
          />
        </div>

        {/* Page brightness overlay */}
        <div
          className="fixed inset-0 pointer-events-none transition-all duration-4000"
          style={{
            opacity: lightsOn ? 0 : 0.9,
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 70%, rgba(0,0,0,0.95) 100%)",
            zIndex: 10,
          }}
        />

        <div className="absolute top-0 left-0 right-0 z-30 bg-white bg-opacity-90 border-b border-gray-200">
          <div className="flex justify-center items-start py-8 space-x-6">
            <NavigationLight
              label="Products"
              delay={0}
              isOn={lightsOn}
              menuItems={["LED Grow Lights", "HPS Systems", "Ballasts", "Reflectors"]}
            />
            <NavigationLight
              label="Solutions"
              delay={0.4}
              isOn={lightsOn}
              menuItems={["Commercial Setup", "Home Growing", "Greenhouse", "Vertical Farming"]}
            />
            <NavigationLight
              label="Support"
              delay={0.8}
              isOn={lightsOn}
              menuItems={["Installation Guide", "Troubleshooting", "Warranty", "Technical Support"]}
            />
            <NavigationLight
              label="About"
              delay={1.2}
              isOn={lightsOn}
              menuItems={["Our Story", "Mission", "Team", "Certifications"]}
            />
            <NavigationLight
              label="Contact"
              delay={1.6}
              isOn={lightsOn}
              menuItems={["Sales Team", "Support", "Locations", "Distributors"]}
            />
            <NavigationLight
              label="Lighting Solutions"
              delay={2.0}
              isOn={lightsOn}
              menuItems={["Custom Design", "Energy Efficiency", "Light Planning", "Consultation"]}
            />
            <NavigationLight
              label="Get Quote"
              delay={2.4}
              isOn={lightsOn}
              menuItems={["Request Quote", "Bulk Pricing", "Financing", "Leasing Options"]}
            />
          </div>
        </div>

        {/* Main content */}
        <header className="relative py-20 px-4" style={{ zIndex: 1, marginTop: "140px" }}>
          <div className="text-center space-y-8">
            <h1
              className="text-6xl font-bold transition-colors duration-4000"
              style={{
                color: lightsOn ? "#8B4513" : "#666666",
                textShadow: lightsOn ? "0 2px 4px rgba(139,69,19,0.3)" : "none",
              }}
            >
              GrowTech Professional
            </h1>
            <div
              className="text-xl transition-colors duration-4000"
              style={{
                color: lightsOn ? "#A0522D" : "#888888",
              }}
            >
              Premium Horticultural Lighting Solutions • Professional Grade Equipment
            </div>
          </div>
        </header>
      </div>
    </div>
  )
}

export default GrowRoomEntrance
