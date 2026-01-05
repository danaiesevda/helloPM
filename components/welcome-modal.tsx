"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Rocket, Code, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const STORAGE_KEY = "hellopm-welcome-seen"

interface WelcomeModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function WelcomeModal({ open: controlledOpen, onOpenChange }: WelcomeModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  useEffect(() => {
    // Only auto-open if not controlled from outside
    if (controlledOpen === undefined) {
      const hasSeen = localStorage.getItem(STORAGE_KEY)
      if (!hasSeen) {
        setTimeout(() => setInternalOpen(true), 300)
      }
    }
  }, [controlledOpen])

  const handlePlayAround = () => {
    setIsOpen(false)
    localStorage.setItem(STORAGE_KEY, "true")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={() => {}}>
          <DialogContent className="max-w-2xl p-0 border-0 bg-transparent shadow-none overflow-visible" showCloseButton={false}>
            <DialogTitle className="sr-only">Welcome to PineApple</DialogTitle>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background blur-3xl -z-10"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
                    "radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
                    "radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)",
                  ],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />

              <div className="relative bg-card border border-border rounded-2xl p-8 md:p-12 shadow-2xl">
                {/* Floating icons animation */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.div
                    animate={{ rotate: [0, 360], y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="h-6 w-6 text-primary/60" />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: [360, 0], y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  >
                    <Rocket className="h-6 w-6 text-primary/60" />
                  </motion.div>
                </div>

                <div className="absolute top-4 left-4 flex gap-2">
                  <motion.div
                    animate={{ rotate: [0, -360], y: [0, -8, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <Code className="h-6 w-6 text-primary/60" />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: [360, 0], y: [0, 8, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  >
                    <Zap className="h-6 w-6 text-primary/60" />
                  </motion.div>
                </div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-center space-y-6"
                >
                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold text-foreground leading-tight"
                  >
                    A SaaS CRM I planned, managed, built, and shipped. No slides were harmed in the process :)
                  </motion.h1>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
                  >
                    From discovery and roadmapping to execution and launch, I owned the full product journey. This project shows how I work as a PM: structured when needed, flexible when reality hits, and always focused on getting a real product live.
                  </motion.p>

                  {/* Button */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="pt-4"
                  >
                    <Button
                      onClick={handlePlayAround}
                      size="lg"
                      className="px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-block"
                      >
                        Play Around
                      </motion.span>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
