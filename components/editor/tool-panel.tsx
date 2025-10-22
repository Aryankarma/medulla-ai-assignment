"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { FlipHorizontal, FlipVertical } from "lucide-react"

interface ToolPanelProps {
  rotation: number
  setRotation: (value: number) => void
  brightness: number
  setBrightness: (value: number) => void
  contrast: number
  setContrast: (value: number) => void
  saturation: number
  setSaturation: (value: number) => void
  grayscale: number
  setGrayscale: (value: number) => void
  flipH: boolean
  setFlipH: (value: boolean) => void
  flipV: boolean
  setFlipV: (value: boolean) => void
}

export function ToolPanel({
  rotation,
  setRotation,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  saturation,
  setSaturation,
  grayscale,
  setGrayscale,
  flipH,
  setFlipH,
  flipV,
  setFlipV,
}: ToolPanelProps) {
  return (
    <div className="space-y-4">
      {/* Rotation */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label className="text-sm">Rotation</Label>
          <span className="text-xs text-muted-foreground">{rotation}°</span>
        </div>
        <Slider
          value={[rotation]}
          onValueChange={(value) => setRotation(value[0])}
          min={0}
          max={360}
          step={1}
          className="w-full"
        />
      </div>

      {/* Brightness */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label className="text-sm">Brightness</Label>
          <span className="text-xs text-muted-foreground">{brightness}%</span>
        </div>
        <Slider
          value={[brightness]}
          onValueChange={(value) => setBrightness(value[0])}
          min={0}
          max={200}
          step={1}
          className="w-full"
        />
      </div>

      {/* Contrast */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label className="text-sm">Contrast</Label>
          <span className="text-xs text-muted-foreground">{contrast}%</span>
        </div>
        <Slider
          value={[contrast]}
          onValueChange={(value) => setContrast(value[0])}
          min={0}
          max={200}
          step={1}
          className="w-full"
        />
      </div>

      {/* Saturation */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label className="text-sm">Saturation</Label>
          <span className="text-xs text-muted-foreground">{saturation}%</span>
        </div>
        <Slider
          value={[saturation]}
          onValueChange={(value) => setSaturation(value[0])}
          min={0}
          max={200}
          step={1}
          className="w-full"
        />
      </div>

      {/* Grayscale */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label className="text-sm">Grayscale</Label>
          <span className="text-xs text-muted-foreground">{grayscale}%</span>
        </div>
        <Slider
          value={[grayscale]}
          onValueChange={(value) => setGrayscale(value[0])}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Flip Buttons */}
      <div className="flex gap-2 pt-2">
        <Button
          variant={flipH ? "default" : "outline"}
          size="sm"
          onClick={() => setFlipH(!flipH)}
          className="flex-1 gap-2"
        >
          <FlipHorizontal className="w-4 h-4" />
          Flip H
        </Button>
        <Button
          variant={flipV ? "default" : "outline"}
          size="sm"
          onClick={() => setFlipV(!flipV)}
          className="flex-1 gap-2"
        >
          <FlipVertical className="w-4 h-4" />
          Flip V
        </Button>
      </div>
    </div>
  )
}
