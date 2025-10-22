"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, RotateCw, Undo2 } from "lucide-react"
import { ToolPanel } from "./tool-panel"
import { AdvancedTools } from "./advanced-tools"
import { BeforeAfterSlider } from "./before-after-slider"

interface ImageEditorProps {
  originalImage: string
  onBack: () => void
}

interface TextElement {
  id: string
  text: string
  x: number
  y: number
  size: number
  color: string
}

interface ShapeElement {
  id: string
  type: "rectangle" | "circle"
  x: number
  y: number
  width: number
  height: number
  color: string
}

export function ImageEditor({ originalImage, onBack }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [editedImage, setEditedImage] = useState<string>(originalImage)
  const [history, setHistory] = useState<string[]>([originalImage])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [showComparison, setShowComparison] = useState(false)

  // Image manipulation state
  const [rotation, setRotation] = useState(0)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [grayscale, setGrayscale] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)

  // Advanced tools state
  const [cropMode, setCropMode] = useState(false)
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null)
  const [cropEnd, setCropEnd] = useState<{ x: number; y: number } | null>(null)
  const [drawMode, setDrawMode] = useState(false)
  const [drawColor, setDrawColor] = useState("#000000")
  const [drawSize, setDrawSize] = useState(3)
  const [textMode, setTextMode] = useState(false)
  const [textInput, setTextInput] = useState("")
  const [textSize, setTextSize] = useState(20)
  const [textColor, setTextColor] = useState("#000000")
  const [textElements, setTextElements] = useState<TextElement[]>([])
  const [shapeMode, setShapeMode] = useState<"none" | "rectangle" | "circle">("none")
  const [shapeColor, setShapeColor] = useState("#000000")
  const [shapeElements, setShapeElements] = useState<ShapeElement[]>([])

  useEffect(() => {
    drawImage()
  }, [editedImage, rotation, brightness, contrast, saturation, grayscale, flipH, flipV, textElements, shapeElements])

  const drawImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height

      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%)`
      ctx.drawImage(img, 0, 0)

      ctx.restore()

      textElements.forEach((textEl) => {
        ctx.fillStyle = textEl.color
        ctx.font = `${textEl.size}px Arial`
        ctx.fillText(textEl.text, textEl.x, textEl.y)
      })

      shapeElements.forEach((shape) => {
        ctx.fillStyle = shape.color
        if (shape.type === "rectangle") {
          ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
        } else if (shape.type === "circle") {
          ctx.beginPath()
          ctx.arc(shape.x + shape.width / 2, shape.y + shape.height / 2, shape.width / 2, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    }
    img.src = editedImage
  }

  const addToHistory = (newImage: string) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newImage)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setEditedImage(newImage)
  }

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setEditedImage(history[newIndex])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setEditedImage(history[newIndex])
    }
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = "edited-image.png"
    link.click()
  }

  const resetImage = () => {
    setEditedImage(originalImage)
    setRotation(0)
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setGrayscale(0)
    setFlipH(false)
    setFlipV(false)
    setHistory([originalImage])
    setHistoryIndex(0)
    setTextElements([])
    setShapeElements([])
  }

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cropMode || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    setCropStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cropMode || !cropStart || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    setCropEnd({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleCanvasMouseUp = () => {
    if (!cropMode || !cropStart || !cropEnd) return
    applyCrop()
  }

  const handleCanvasClickForText = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!textMode || !textInput || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newTextElement: TextElement = {
      id: Date.now().toString(),
      text: textInput,
      x,
      y,
      size: textSize,
      color: textColor,
    }

    setTextElements([...textElements, newTextElement])
    setTextInput("")
  }

  const handleCanvasClickForShape = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (shapeMode === "none" || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newShape: ShapeElement = {
      id: Date.now().toString(),
      type: shapeMode,
      x,
      y,
      width: 50,
      height: 50,
      color: shapeColor,
    }

    setShapeElements([...shapeElements, newShape])
  }

  const applyCrop = async () => {
    if (!cropStart || !cropEnd) return

    const canvas = canvasRef.current
    if (!canvas) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const tempCanvas = document.createElement("canvas")
      const ctx = tempCanvas.getContext("2d")
      if (!ctx) return

      const x = Math.min(cropStart.x, cropEnd.x)
      const y = Math.min(cropStart.y, cropEnd.y)
      const width = Math.abs(cropEnd.x - cropStart.x)
      const height = Math.abs(cropEnd.y - cropStart.y)

      tempCanvas.width = width
      tempCanvas.height = height
      ctx.drawImage(img, x, y, width, height, 0, 0, width, height)

      const croppedImage = tempCanvas.toDataURL()
      addToHistory(croppedImage)
      setCropMode(false)
      setCropStart(null)
      setCropEnd(null)
    }
    img.src = editedImage
  }

  const applyResize = async (width: number, height: number) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.drawImage(img, 0, 0, width, height)
      const resizedImage = canvas.toDataURL()
      addToHistory(resizedImage)
    }
    img.src = editedImage
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Image Editor</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={downloadImage} className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-4">
                {showComparison ? (
                  <BeforeAfterSlider before={originalImage} after={editedImage} />
                ) : (
                  <div
                    ref={containerRef}
                    className="flex justify-center bg-muted rounded-lg p-4 min-h-96 overflow-auto"
                  >
                    <canvas
                      ref={canvasRef}
                      className="max-w-full max-h-96 object-contain cursor-crosshair"
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      onClick={(e) => {
                        handleCanvasClickForText(e)
                        handleCanvasClickForShape(e)
                      }}
                    />
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <Button
                    variant={showComparison ? "default" : "outline"}
                    onClick={() => setShowComparison(!showComparison)}
                    className="flex-1"
                  >
                    {showComparison ? "Hide" : "Show"} Comparison
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tools Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={undo}
                    disabled={historyIndex === 0}
                    className="flex-1 bg-transparent"
                  >
                    <Undo2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={redo}
                    disabled={historyIndex === history.length - 1}
                    className="flex-1 bg-transparent"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetImage} className="flex-1 bg-transparent">
                    Reset
                  </Button>
                </div>

                <Tabs defaultValue="adjust" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="adjust">Adjust</TabsTrigger>
                    <TabsTrigger value="tools">Tools</TabsTrigger>
                  </TabsList>

                  <TabsContent value="adjust" className="space-y-4 mt-4">
                    <ToolPanel
                      rotation={rotation}
                      setRotation={setRotation}
                      brightness={brightness}
                      setBrightness={setBrightness}
                      contrast={contrast}
                      setContrast={setContrast}
                      saturation={saturation}
                      setSaturation={setSaturation}
                      grayscale={grayscale}
                      setGrayscale={setGrayscale}
                      flipH={flipH}
                      setFlipH={setFlipH}
                      flipV={flipV}
                      setFlipV={setFlipV}
                    />
                  </TabsContent>

                  <TabsContent value="tools" className="space-y-4 mt-4">
                    <AdvancedTools
                      cropMode={cropMode}
                      setCropMode={setCropMode}
                      applyCrop={applyCrop}
                      applyResize={applyResize}
                      textMode={textMode}
                      setTextMode={setTextMode}
                      textInput={textInput}
                      setTextInput={setTextInput}
                      textSize={textSize}
                      setTextSize={setTextSize}
                      textColor={textColor}
                      setTextColor={setTextColor}
                      shapeMode={shapeMode}
                      setShapeMode={setShapeMode}
                      shapeColor={shapeColor}
                      setShapeColor={setShapeColor}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
