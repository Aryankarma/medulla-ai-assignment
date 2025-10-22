"use client"

import type React from "react"
import { useState, useRef } from "react"

interface BeforeAfterSliderProps {
  before: string
  after: string
}

export function BeforeAfterSlider({ before, after }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleTouchStart = () => {
    setIsDragging(true)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-96 overflow-hidden rounded-lg bg-muted"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Before Image */}
      <div className="absolute inset-0">
        <img src={before || "/placeholder.svg"} alt="Before" className="w-full h-full object-contain" />
        <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">Before</div>
      </div>

      {/* After Image */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
        <img
          src={after || "/placeholder.svg"}
          alt="After"
          className="w-full h-full object-contain"
          style={{ width: `${(100 / sliderPosition) * 100}%` }}
        />
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">After</div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-primary cursor-col-resize select-none"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground rounded-full p-2 shadow-lg cursor-grab active:cursor-grabbing">
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-current"></div>
            <div className="w-1 h-4 bg-current"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
