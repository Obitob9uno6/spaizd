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
        setTimeout(() => setWarmupPhase(2), delay * 1000 + 500)
        setTimeout(() => setWarmupPhase(3), delay * 1000 + 1000)
        setTimeout(() => setWarmupPhase(4), delay * 1000 + 1500)
        setTimeout(() => setWarmupPhase(5), delay * 1000 + 2000) // Full 1000W
      }
    }, [isOn, delay])

    const toggleDropdown = () => {
      setCordPulled(true)
      setTimeout(() => setCordPulled(false), 200)

      if (label === "Drops") {
        setShowComingSoon(true)
        return
      }

      setShowDropdown(!showDropdown)
    }

    const handleNavigation = (item: string) => {
      if (label === "Drops") {
        setShowComingSoon(true)
        return
      }

      let path = "/"
      if (label === "Shop") path = "/shop"
      else if (label === "VIP") path = "/vip"
      else if (label === "About") path = "/about"
      else if (label === "Account") {
        if (item === "Cart") path = "/cart"
        else if (item === "Search") path = "/shop"
        else path = "/account"
      }

      router.push(path)
      setShowDropdown(false)
    }

    const getLightIntensity = () => {
      switch (warmupPhase) {
        case 0:
          return 0
        case 1:
          return 20 // 200W
        case 2:
          return 40 // 400W
        case 3:
          return 60 // 600W
        case 4:
          return 80 // 800W
        case 5:
          return 100 // 1000W
        default:
          return 0
      }
    }

    return (
      <div className="relative" style={{ width: "140px" }}>
        {/* Ceiling mount */}
        <div className="flex flex-col items-center">
          <div
            className="rounded-full shadow-lg"
            style={{
              width: "12px",
              height: "12px",
              background: "radial-gradient(circle at 30% 30%, #999999, #555555)",
              boxShadow: "inset -1px -1px 2px rgba(0,0,0,0.5)",
            }}
          />
          <div
            style={{
              width: "3px",
              height: "25px",
              background: "linear-gradient(to right, #444444, #777777, #444444)",
            }}
          />
        </div>

        {/* Professional light fixture */}
        <div className="relative" style={{ width: "140px", height: "50px" }}>
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: "linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 25%, #d0d0d0 50%, #c0c0c0 75%, #b0b0b0 100%)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            }}
          >
            {/* 1000W DE Lamp */}
            <div
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000"
              style={{
                width: "32px",
                height: "32px",
                background:
                  warmupPhase > 0
                    ? `radial-gradient(circle, rgba(255,215,0,${getLightIntensity() / 100}) 0%, rgba(255,204,68,${getLightIntensity() / 150}) 50%, rgba(255,170,0,${getLightIntensity() / 200}) 100%)`
                    : "radial-gradient(circle, #888888 0%, #666666 50%, #444444 100%)",
                boxShadow: warmupPhase > 0 ? `0 0 ${warmupPhase * 8}px rgba(255,215,0,0.6)` : "none",
              }}
            >
              {/* Wattage indicator */}
              <div
                className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                style={{
                  color: warmupPhase > 2 ? "#333" : "#666",
                  fontSize: "8px",
                }}
              >
                {Math.round(getLightIntensity() * 10)}W
              </div>
            </div>
          </div>
        </div>

        {/* Pull cord chain */}
        <div className="flex flex-col items-center">
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
              width: "14px",
              height: "14px",
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
                className="block w-full text-left px-4 py-3 text-sm hover:bg-green-50 hover:text-green-800 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                style={{ color: "#333333" }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">🌿</span>
                  <span>{item}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Light beam effect */}
        {warmupPhase > 0 && (
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2"
            style={{
              width: `${60 + warmupPhase * 20}px`,
              height: `${40 + warmupPhase * 15}px`,
              background: `radial-gradient(ellipse at center top, rgba(255,215,0,${warmupPhase * 0.1}) 0%, rgba(255,204,68,${warmupPhase * 0.05}) 50%, transparent 100%)`,
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
          <div className="flex justify-center items-start py-8 space-x-8">
            <NavigationLight
              label="Shop"
              delay={0}
              isOn={lightsOn}
              menuItems={["All Products", "New Arrivals", "Best Sellers", "Sale Items"]}
            />
            <NavigationLight
              label="Drops"
              delay={0.3}
              isOn={lightsOn}
              menuItems={["Coming Soon", "Past Drops", "VIP Early Access"]}
            />
            <NavigationLight
              label="VIP"
              delay={0.6}
              isOn={lightsOn}
              menuItems={["Membership Tiers", "Exclusive Access", "Member Benefits", "Upgrade"]}
            />
            <NavigationLight
              label="About"
              delay={0.9}
              isOn={lightsOn}
              menuItems={["Our Story", "Mission", "Team", "Contact"]}
            />
            <NavigationLight label="Account" delay={1.2} isOn={lightsOn} menuItems={["Search", "Cart", "Profile"]} />
          </div>
        </div>

        {/* Main content */}
        <header className="relative py-20 px-4" style={{ zIndex: 1, marginTop: "120px" }}>
          <div className="text-center space-y-8">
            <h1
              className="text-6xl font-bold transition-colors duration-4000"
              style={{
                color: lightsOn ? "#8B4513" : "#666666",
                textShadow: lightsOn ? "0 2px 4px rgba(139,69,19,0.3)" : "none",
              }}
            >
              Grow Spaizd
            </h1>
            <div
              className="text-xl transition-colors duration-4000"
              style={{
                color: lightsOn ? "#A0522D" : "#888888",
              }}
            >
              Premium Cannabis Streetwear • Cultivation Inspired
            </div>
          </div>
        </header>
      </div>
    </div>
  )
}

export default GrowRoomEntrance
