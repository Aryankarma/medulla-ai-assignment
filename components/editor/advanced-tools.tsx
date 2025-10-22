"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Crop, Type, Shapes } from "lucide-react"

interface AdvancedToolsProps {
  cropMode: boolean
  setCropMode: (value: boolean) => void
  applyCrop: () => void
  applyResize: (width: number, height: number) => void
  textMode: boolean
  setTextMode: (value: boolean) => void
  textInput: string
  setTextInput: (value: string) => void
  textSize: number
  setTextSize: (value: number) => void
  textColor: string
  setTextColor: (value: string) => void
  shapeMode: "none" | "rectangle" | "circle"
  setShapeMode: (value: "none" | "rectangle" | "circle") => void
  shapeColor: string
  setShapeColor: (value: string) => void
}

export function AdvancedTools({
  cropMode,
  setCropMode,
  applyCrop,
  applyResize,
  textMode,
  setTextMode,
  textInput,
  setTextInput,
  textSize,
  setTextSize,
  textColor,
  setTextColor,
  shapeMode,
  setShapeMode,
  shapeColor,
  setShapeColor,
}: AdvancedToolsProps) {
  return (
    <Tabs defaultValue="crop" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="crop" className="gap-1">
          <Crop className="w-4 h-4" />
          <span className="hidden sm:inline">Crop</span>
        </TabsTrigger>
        <TabsTrigger value="text" className="gap-1">
          <Type className="w-4 h-4" />
          <span className="hidden sm:inline">Text</span>
        </TabsTrigger>
        <TabsTrigger value="shapes" className="gap-1">
          <Shapes className="w-4 h-4" />
          <span className="hidden sm:inline">Shapes</span>
        </TabsTrigger>
      </TabsList>

      {/* Crop Tool */}
      <TabsContent value="crop" className="space-y-4 mt-4">
        <div>
          <Label className="text-sm">Resize Image</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              type="number"
              placeholder="Width"
              defaultValue={800}
              onChange={(e) => {
                const height = Math.round((Number.parseInt(e.target.value) * 600) / 800)
                applyResize(Number.parseInt(e.target.value), height)
              }}
            />
            <Input
              type="number"
              placeholder="Height"
              defaultValue={600}
              onChange={(e) => {
                const width = Math.round((Number.parseInt(e.target.value) * 800) / 600)
                applyResize(width, Number.parseInt(e.target.value))
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Button variant={cropMode ? "default" : "outline"} className="w-full" onClick={() => setCropMode(!cropMode)}>
            {cropMode ? "Cancel Crop" : "Enable Crop"}
          </Button>
          {cropMode && (
            <p className="text-xs text-muted-foreground">
              Click and drag on the image to select the crop area, then click Apply Crop
            </p>
          )}
        </div>
      </TabsContent>

      {/* Text Tool */}
      <TabsContent value="text" className="space-y-4 mt-4">
        <div>
          <Label className="text-sm">Text</Label>
          <Input
            type="text"
            placeholder="Enter text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="text-sm">Size</Label>
            <span className="text-xs text-muted-foreground">{textSize}px</span>
          </div>
          <Slider
            value={[textSize]}
            onValueChange={(value) => setTextSize(value[0])}
            min={10}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div>
          <Label className="text-sm">Color</Label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-full h-10 rounded cursor-pointer mt-2"
          />
        </div>

        <Button variant={textMode ? "default" : "outline"} className="w-full" onClick={() => setTextMode(!textMode)}>
          {textMode ? "Cancel Text" : "Enable Text"}
        </Button>
        {textMode && (
          <p className="text-xs text-muted-foreground">
            Enter text above, then click on the image where you want to place it
          </p>
        )}
      </TabsContent>

      {/* Shapes Tool */}
      <TabsContent value="shapes" className="space-y-4 mt-4">
        <div>
          <Label className="text-sm">Shape Color</Label>
          <input
            type="color"
            value={shapeColor}
            onChange={(e) => setShapeColor(e.target.value)}
            className="w-full h-10 rounded cursor-pointer mt-2"
          />
        </div>

        <div className="space-y-2">
          <Button
            variant={shapeMode === "rectangle" ? "default" : "outline"}
            className="w-full"
            onClick={() => setShapeMode(shapeMode === "rectangle" ? "none" : "rectangle")}
          >
            Rectangle
          </Button>
          <Button
            variant={shapeMode === "circle" ? "default" : "outline"}
            className="w-full"
            onClick={() => setShapeMode(shapeMode === "circle" ? "none" : "circle")}
          >
            Circle
          </Button>
        </div>

        {shapeMode !== "none" && (
          <p className="text-xs text-muted-foreground">Click on the image to place a {shapeMode}</p>
        )}
      </TabsContent>
    </Tabs>
  )
}
