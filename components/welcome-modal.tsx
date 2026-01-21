"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Rocket, Zap, Code } from "lucide-react"

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Wait for client-side only
    if (typeof window === 'undefined') return
    
    // Always show welcome modal on every visit/refresh
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 800)
    
    return () => {
      clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
  }

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} >
      <DialogContent className="max-w-3xl p-0 border-0 bg-transparent shadow-none overflow-visible" showCloseButton={false}>
        <DialogTitle className="sr-only">Welcome to Project Management Platform</DialogTitle>
        <div className="relative z-50">
          {/* Animated ambient light background - moves behind the modal */}
          <div className="absolute inset-0 rounded-2xl animate-blue-gradient blur-lg -z-10 scale-100 opacity-25" />
          
          {/* Main content card */}
          <div className="relative bg-background border border-border/50 rounded-2xl p-8 md:p-12 shadow-2xl animate-scale-in">
            {/* Icons in corners with animations */}
            {/* Top Left Icons */}
            <div className="absolute top-6 left-6 flex flex-col gap-4">
              <div className="animate-float-code">
                <Code className="h-8 w-8" style={{ color: "#3A5DAD" }} />
              </div>
              <div className="animate-pulse-lightning">
                <Zap className="h-8 w-8" style={{ color: "#3A5DAD" }} />
              </div>
            </div>

            {/* Top Right Icons */}
            <div className="absolute top-6 right-6 flex flex-col gap-4">
              <div className="animate-rotate-sparkle">
                <Sparkles className="h-8 w-8" style={{ color: "#3A5DAD" }} />
              </div>
              <div className="animate-float-rocket">
                <Rocket className="h-8 w-8" style={{ color: "#3A5DAD" }} />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6 mt-20 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <h1 
                className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent animate-gradient leading-tight"
                style={{
                  backgroundImage: "linear-gradient(90deg, #000000 0%, #3A5DAD 25%, #EFB100 50%, #3A5DAD 75%, #000000 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                Project Management Platform
              </h1>
            </div>

            {/* Description */}
            <div className="text-center mb-10 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <p className="text-base md:text-lg text-black dark:text-white leading-relaxed max-w-2xl mx-auto" >
                I designed and shipped an open-source project management platform that helps teams plan work, track progress, and stay aligned. Built for real workflows, it supports prioritisation and smooth collaboration from start to finish
              </p>
            </div>

            {/* CTA Button */}
            <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <Button
                onClick={handleClose}
                size="lg"
                className="group relative overflow-hidden px-8 py-6 text-base font-semibold rounded-lg text-white transition-all duration-300 animate-pulse-button !border-0 !ring-0 focus:!ring-0"
                style={{ backgroundColor: "#3A5DAD", border: "none", outline: "none", boxShadow: "none" }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.backgroundColor = "#2d4a8a"; 
                  e.currentTarget.style.border = "none";
                  e.currentTarget.style.outline = "none"; e.currentTarget.style.boxShadow = "none";
                  }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.backgroundColor = "#3A5DAD"; 
                  e.currentTarget.style.border = "none";
                  e.currentTarget.style.outline = "none"; e.currentTarget.style.boxShadow = "none";
                  }}
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 animate-shimmer" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
