"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Custom cursor: the app's sticker (public/cursor-sticker.webp), spinning and centred on the pointer.
 * Only for mouse/trackpad users. Over text fields the normal text cursor is shown instead, so typing
 * and selecting text feel normal.
 */

const TEXT_FIELDS = 'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"]), textarea, select, [contenteditable="true"], [contenteditable=""]'
const INTERACTIVE = 'a, button, [role="button"], [role="tab"], [role="menuitem"], [role="option"], label, summary'

export function StickerCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [overText, setOverText] = useState(false)
  const [overLink, setOverLink] = useState(false)
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setEnabled(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const html = document.documentElement
    html.classList.add("sticker-cursor")
    let frame = 0
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return
      const { clientX: x, clientY: y } = e
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (ref.current) ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      })
      const target = e.target instanceof Element ? e.target : null
      setVisible(true)
      setOverText(!!target?.closest(TEXT_FIELDS))
      setOverLink(!!target?.closest(INTERACTIVE))
    }
    const onLeave = () => setVisible(false)
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
    html.addEventListener("pointerleave", onLeave)
    window.addEventListener("blur", onLeave)
    return () => {
      cancelAnimationFrame(frame)
      html.classList.remove("sticker-cursor")
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      html.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("blur", onLeave)
    }
  }, [enabled])

  if (!enabled) return null
  const size = overLink ? 44 : 36

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[2147483647]"
      style={{ opacity: visible && !overText ? 1 : 0, transition: "opacity 120ms ease", willChange: "transform" }}
    >
      <style>{`
        html.sticker-cursor, html.sticker-cursor * { cursor: none !important; }
        html.sticker-cursor :is(${TEXT_FIELDS}) { cursor: text !important; }
        @keyframes sticker-cursor-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { .sticker-cursor-spin { animation: none !important; } }
      `}</style>
      <div
        style={{
          position: "absolute",
          width: size,
          height: size,
          left: -size / 2,
          top: -size / 2,
          transform: `scale(${pressed ? 0.85 : 1})`,
          transition: "width 180ms ease, height 180ms ease, left 180ms ease, top 180ms ease, transform 120ms ease",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cursor-sticker.webp"
          alt=""
          className="sticker-cursor-spin"
          style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))", animation: "sticker-cursor-spin 8s linear infinite" }}
        />
      </div>
    </div>
  )
}
