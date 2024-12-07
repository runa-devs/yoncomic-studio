import { bubbles } from "@/app/(editor)/comics/[id]/_components/bubbles";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToolStore } from "@/hooks/use-tool";
import { cn } from "@/lib/utils";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { AlignVerticalJustifyStart, Image, Settings2, Type } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Circle, Layer, Rect, Stage, Text, Transformer } from "react-konva";

interface ImageEditorProps {
  imageUrl: string;
  width: number;
  height: number;
}

interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  draggable: boolean;
  type: "text" | "bubble";
  bubbleId?: string;
  verticalAlign?: boolean;
}

interface Shape {
  id: string;
  type: "circle" | "rectangle" | "bubble";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  draggable: boolean;
  bubbleId?: string;
}

interface DrawLine {
  id: string;
  points: number[];
  tool: string;
}

const FONT_FAMILIES = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "游ゴシック",
  "メイリオ",
  "ＭＳ ゴシック",
];

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, width, height }) => {
  const { currentTool, selectedBubbleId } = useToolStore();
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [lines, setLines] = useState<DrawLine[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [bubbleImages, setBubbleImages] = useState<Record<string, HTMLImageElement>>({});
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [stylePosition, setStylePosition] = useState({ x: 0, y: 0 });
  const stageRef = useRef<Konva.Stage>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPosition, setEditingPosition] = useState({ x: 0, y: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  // 背景画像の読み込み
  useEffect(() => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    // プロキシURLを使用
    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
    image.src = proxyUrl;
    image.onload = () => {
      setBackgroundImage(image);
    };
    image.onerror = (e) => {
      console.error("Image load error:", e);
    };
  }, [imageUrl]);

  // 画像の読み込み
  useEffect(() => {
    const imageElement = new window.Image();
    imageElement.crossOrigin = "anonymous";
    imageElement.src = imageUrl;
    imageElement.onload = () => {
      setImage(imageElement);
    };
  }, [imageUrl]);

  // 吹き出し画像の事前読み込み
  useEffect(() => {
    bubbles.forEach((bubble) => {
      const img = new window.Image();
      img.src = `/bubbles/${bubble.src}`;
      img.onload = () => {
        setBubbleImages((prev) => ({ ...prev, [bubble.id]: img }));
      };
    });
  }, []);

  const handleMouseDown = (evt: KonvaEventObject<MouseEvent>) => {
    if (currentTool === "hand") return;

    // 消しゴムツールの処理
    if (currentTool === "eraser") {
      const clickedOnShape = evt.target !== evt.target.getStage();
      if (clickedOnShape) {
        const targetId = evt.target.attrs.id;
        setLines(lines.filter((line) => line.id !== targetId));
        setShapes(shapes.filter((shape) => shape.id !== targetId));
        setAnnotations(annotations.filter((annotation) => annotation.id !== targetId));
        return;
      }
    }

    setIsDrawing(true);
    const pos = evt.target.getStage()?.getPointerPosition();
    if (!pos) return;

    switch (currentTool) {
      case "pen":
        const newLine: DrawLine = {
          id: `line-${Date.now()}`,
          points: [pos.x, pos.y],
          tool: "pen",
        };
        setLines([...lines, newLine]);
        break;
      case "circle":
        const newCircle: Shape = {
          id: `circle-${Date.now()}`,
          type: "circle",
          x: pos.x,
          y: pos.y,
          radius: 0,
          draggable: true,
        };
        setShapes([...shapes, newCircle]);
        break;
      case "rectangle":
        const newRect: Shape = {
          id: `rect-${Date.now()}`,
          type: "rectangle",
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          draggable: true,
        };
        setShapes([...shapes, newRect]);
        break;
      case "bubble":
        if (selectedBubbleId) {
          const newBubble: Shape = {
            id: `bubble-${Date.now()}`,
            type: "bubble",
            x: pos.x,
            y: pos.y,
            width: 200,
            height: 100,
            draggable: true,
            bubbleId: selectedBubbleId,
          };
          setShapes([...shapes, newBubble]);
        }
        break;
    }
  };

  const handleMouseMove = (evt: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;

    const pos = evt.target.getStage()?.getPointerPosition();
    if (!pos) return;

    switch (currentTool) {
      case "pen":
        const lastLine = lines[lines.length - 1];
        if (lastLine) {
          lastLine.points = lastLine.points.concat([pos.x, pos.y]);
          setLines([...lines.slice(0, -1), lastLine]);
        }
        break;
      case "circle":
        const lastCircle = shapes[shapes.length - 1];
        if (lastCircle && lastCircle.type === "circle") {
          const dx = pos.x - lastCircle.x;
          const dy = pos.y - lastCircle.y;
          const radius = Math.sqrt(dx * dx + dy * dy);
          const updatedCircle = { ...lastCircle, radius };
          setShapes([...shapes.slice(0, -1), updatedCircle]);
        }
        break;
      case "rectangle":
        const lastRect = shapes[shapes.length - 1];
        if (lastRect && lastRect.type === "rectangle") {
          const updatedRect = {
            ...lastRect,
            width: pos.x - lastRect.x,
            height: pos.y - lastRect.y,
          };
          setShapes([...shapes.slice(0, -1), updatedRect]);
        }
        break;
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleStageClick = (evt: KonvaEventObject<MouseEvent>) => {
    if (currentTool !== "text") return;

    const clickedOnEmpty = evt.target === evt.target.getStage();
    if (clickedOnEmpty) {
      const pos = evt.target.getStage()?.getPointerPosition();
      if (pos) {
        const newAnnotation: Annotation = {
          id: `text-${Date.now()}`,
          x: pos.x,
          y: pos.y,
          text: "テキストを入力",
          fontSize,
          fontFamily,
          fill: textColor,
          draggable: true,
          type: "text",
          verticalAlign: true,
        };
        setAnnotations([...annotations, newAnnotation]);
      }
    }
  };

  const getSelectedText = () => {
    return annotations.find((a) => a.id === selectedId);
  };

  const updateSelectedText = (updates: Partial<Annotation>) => {
    setAnnotations(annotations.map((a) => (a.id === selectedId ? { ...a, ...updates } : a)));
  };

  const handleTextClick = (annotation: Annotation) => {
    if (currentTool === "hand") {
      setSelectedId(annotation.id);
      const stage = stageRef.current;
      if (stage) {
        const node = stage.findOne(`#${annotation.id}`) as Konva.Text;
        if (node && transformerRef.current) {
          transformerRef.current.nodes([node]);
          transformerRef.current.getLayer()?.batchDraw();

          // スタイルボタンの位置を計算
          const textPosition = node.absolutePosition();
          const stageBox = stage.container().getBoundingClientRect();
          const buttonPosition = {
            x: stageBox.left + textPosition.x,
            y: stageBox.top + textPosition.y - 40, // テキストの上部に配置
          };

          // 画面端に近い場合の調整
          const adjustedPosition = calculateButtonPosition(buttonPosition, node);
          setStylePosition(adjustedPosition);
        }
      }
    }
  };

  const calculateButtonPosition = (pos: { x: number; y: number }, textNode: Konva.Text) => {
    const BUTTON_WIDTH = 80; // スタイルボタンの幅
    const BUTTON_HEIGHT = 32; // スタイルボタンの高さ
    const PADDING = 8; // 画面端からの最小距離
    const POPOVER_WIDTH = 320; // ポップオーバーの幅

    // 画面のサイズを取得
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // テキストノードのサイズを取得
    const textWidth = textNode.width() * textNode.scaleX();

    let x = pos.x;
    let y = pos.y;

    // 水平方向の調整（テキストの中央に配置）
    x = pos.x + textWidth / 2 - BUTTON_WIDTH / 2;

    // 画面右端を超える場合の調整
    if (x + POPOVER_WIDTH > windowWidth - PADDING) {
      x = windowWidth - POPOVER_WIDTH - PADDING;
    }
    // 画面左端を超える場合の調整
    if (x < PADDING) {
      x = PADDING;
    }

    // 垂直方向の調整
    if (y < BUTTON_HEIGHT + PADDING) {
      // 上部に表示できない場合は、テキストの下に表示
      y = pos.y + textNode.height() * textNode.scaleY() + PADDING;
    }

    return { x, y };
  };

  const handleTextTransform = (e: KonvaEventObject<Event>) => {
    const textNode = e.target as Konva.Text;
    const scaleX = textNode.scaleX();
    const width = textNode.width() * scaleX;
    const fontSize = Math.round(textNode.fontSize() * scaleX);

    // スケールをリセットして新しい値を設定
    textNode.setAttrs({
      width: width,
      scaleX: 1,
      scaleY: 1,
      fontSize: fontSize,
    });
  };

  const handleShapeTransform = (e: KonvaEventObject<Event>) => {
    const shape = e.target as Konva.Image;
    const scaleX = shape.scaleX();
    const scaleY = shape.scaleY();

    shape.setAttrs({
      width: Math.max(30, shape.width() * scaleX),
      height: Math.max(30, shape.height() * scaleY),
      scaleX: 1,
      scaleY: 1,
    });
  };

  const handleNodeClick = (nodeId: string, nodeType: "text" | "shape") => {
    if (currentTool === "hand") {
      setSelectedId(nodeId);
      const stage = stageRef.current;
      if (stage) {
        const node = stage.findOne(`#${nodeId}`);
        if (node && transformerRef.current) {
          transformerRef.current.nodes([node]);
          transformerRef.current.getLayer()?.batchDraw();

          // テキストの場合は横方向のみ、画像は全方向のリサイズを許可
          transformerRef.current.setAttrs({
            enabledAnchors:
              nodeType === "text"
                ? ["middle-left", "middle-right"]
                : ["top-left", "top-right", "bottom-left", "bottom-right"],
            rotateEnabled: nodeType !== "text",
            padding: 5,
            // アンカーのスタイル設定
            anchorFill: "#ffffff",
            anchorStroke: "#0066ff",
            anchorSize: 8,
            anchorCornerRadius: 2,
            borderStroke: "#0066ff",
            borderDash: undefined,
            keepRatio: false,
          });
        }
      }
    }
  };

  const calculateTextareaPosition = (pos: { x: number; y: number }) => {
    const PADDING = 20; // 画面端からの��小距離
    const TEXTAREA_WIDTH = 200; // テキストエリアの幅
    const TEXTAREA_HEIGHT = 100; // テキストエリアの高さ
    const stage = stageRef.current;
    if (!stage) return pos;

    const stageBox = stage.container().getBoundingClientRect();
    const maxX = window.innerWidth - TEXTAREA_WIDTH - PADDING;
    const maxY = window.innerHeight - TEXTAREA_HEIGHT - PADDING;

    return {
      x: Math.min(Math.max(PADDING, pos.x), maxX),
      y: Math.min(Math.max(PADDING, pos.y), maxY),
    };
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleTextareaBlur = () => {
    setIsEditing(false);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedId) {
      const newAnnotations = annotations.map((a) =>
        a.id === selectedId ? { ...a, text: e.target.value } : a
      );
      setAnnotations(newAnnotations);
    }
  };

  const handleTextDblClick = (annotation: Annotation, evt: KonvaEventObject<MouseEvent>) => {
    if (currentTool !== "hand") return;

    const stage = stageRef.current;
    if (!stage) return;

    const textNode = evt.target as Konva.Text;
    // 現在のスケールとサイズを保存
    const currentWidth = textNode.width();
    const currentFontSize = textNode.fontSize();

    textNode.hide();
    if (transformerRef.current) {
      transformerRef.current.hide();
    }

    // テキストノードの位置を取得
    const textPosition = textNode.absolutePosition();
    const stageBox = stage.container().getBoundingClientRect();
    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };

    // テキストエリアを作成
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    // スタイルを設定
    textarea.value = textNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${currentWidth}px`;
    textarea.style.height = `${textNode.height()}px`;
    textarea.style.fontSize = `${currentFontSize}px`;
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.color = textNode.fill() as string;
    textarea.style.lineHeight = String(textNode.lineHeight() || 1);
    textarea.style.textAlign = textNode.align() || "left";
    textarea.style.transformOrigin = "left top";
    textarea.style.backgroundColor = "white";

    textarea.focus();

    const removeTextarea = () => {
      textarea.parentNode?.removeChild(textarea);
      window.removeEventListener("click", handleOutsideClick);
      textNode.show();
      if (transformerRef.current) {
        transformerRef.current.show();
        transformerRef.current.forceUpdate();
      }
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target !== textarea) {
        // 元のスケールとサイズを維持したまま更新
        textNode.setAttrs({
          text: textarea.value,
          width: currentWidth,
          fontSize: currentFontSize,
          scaleX: 1,
        });
        updateSelectedText({ text: textarea.value });
        removeTextarea();
      }
    };

    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        // 元のスケールとサイズを維持したまま更新
        textNode.setAttrs({
          text: textarea.value,
          width: currentWidth,
          fontSize: currentFontSize,
          scaleX: 1,
        });
        updateSelectedText({ text: textarea.value });
        removeTextarea();
      }
      if (e.key === "Escape") {
        removeTextarea();
      }
    });

    textarea.addEventListener("input", () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    });

    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    });
  };

  return (
    <div className="relative">
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onClick={handleStageClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {backgroundImage && <Image image={backgroundImage} width={width} height={height} />}

          <Image
            key={imageUrl}
            id={imageUrl}
            x={0}
            y={0}
            width={width}
            height={height}
            image={image}
            draggable={currentTool === "hand"}
            onClick={() => handleNodeClick(imageUrl, "shape")}
          />
          {/* 図形の描画 */}
          {shapes.map((shape) => {
            if (shape.type === "circle") {
              return (
                <Circle
                  key={shape.id}
                  id={shape.id}
                  x={shape.x}
                  y={shape.y}
                  radius={shape.radius}
                  stroke="#000000"
                  strokeWidth={2}
                  draggable={currentTool === "hand" && shape.draggable}
                  onClick={() => handleNodeClick(shape.id, "shape")}
                  onTransform={handleShapeTransform}
                />
              );
            } else if (shape.type === "bubble" && shape.bubbleId && bubbleImages[shape.bubbleId]) {
              return (
                <Image
                  key={shape.id}
                  id={shape.id}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  image={bubbleImages[shape.bubbleId]}
                  draggable={currentTool === "hand"}
                  onClick={() => handleNodeClick(shape.id, "shape")}
                  onTransform={handleShapeTransform}
                />
              );
            } else {
              return (
                <Rect
                  key={shape.id}
                  id={shape.id}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  stroke="#000000"
                  strokeWidth={2}
                  draggable={currentTool === "hand" && shape.draggable}
                  onClick={() => handleNodeClick(shape.id, "shape")}
                  onTransform={handleShapeTransform}
                />
              );
            }
          })}
          {/* テキストの描画 */}
          {annotations.map((annotation) => (
            <Text
              direction={annotation.verticalAlign ? "vertical" : "horizontal"}
              key={annotation.id}
              id={annotation.id}
              x={annotation.x}
              y={annotation.y}
              text={
                annotation.verticalAlign
                  ? annotation.text.replace(/\n/g, "").split("").join("\n")
                  : annotation.text
              }
              fontSize={annotation.fontSize}
              fontFamily={annotation.fontFamily}
              fill={annotation.fill}
              draggable={currentTool === "hand" && annotation.draggable}
              onClick={() => handleNodeClick(annotation.id, "text")}
              onDblClick={(e) => handleTextDblClick(annotation, e)}
              onTransform={handleTextTransform}
              padding={5}
            />
          ))}

          {selectedId && currentTool === "hand" && (
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                newBox.width = Math.max(30, newBox.width);
                return newBox;
              }}
              enabledAnchors={["middle-left", "middle-right"]}
              rotateEnabled={false}
              keepRatio={false}
            />
          )}
        </Layer>
      </Stage>

      {/* テキスト編集用テキストエリア */}
      {isEditing && selectedId && (
        <div
          style={{
            position: "absolute",
            left: `${editingPosition.x}px`,
            top: `${editingPosition.y}px`,
            zIndex: 1000,
          }}
          className="min-w-[200px] max-w-[400px]"
        >
          <div className="flex flex-col gap-2 rounded-lg bg-white/80 p-2 backdrop-blur-sm">
            <Textarea
              ref={textareaRef}
              value={getSelectedText()?.text || ""}
              onChange={handleTextareaChange}
              onBlur={handleTextareaBlur}
              className="resize-none bg-transparent"
              rows={3}
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                キャンセル
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedId(null);
                }}
              >
                完了
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* スタイルボタン - 固定位置に表示 */}
      {currentTool === "hand" && selectedId && (
        <div className="fixed right-6 top-4 z-50">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-10 bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <Settings2 className="size-8" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[200px] bg-white/90 backdrop-blur-sm"
              align="end"
              sideOffset={5}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">フォントサイズ</label>
                  <div className="flex items-center gap-2">
                    <Type className="size-4 text-gray-500" />
                    <Slider
                      value={[getSelectedText()?.fontSize || 16]}
                      onValueChange={(value) => updateSelectedText({ fontSize: value[0] })}
                      min={8}
                      max={72}
                      step={1}
                      className="w-[120px]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">フォント</label>
                  <select
                    className="w-full rounded-md border px-2 py-1 text-sm"
                    value={getSelectedText()?.fontFamily}
                    onChange={(e) => updateSelectedText({ fontFamily: e.target.value })}
                  >
                    {FONT_FAMILIES.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">文字��向き</label>
                  <div className="flex gap-1">
                    <Button
                      variant={getSelectedText()?.verticalAlign ? "default" : "outline"}
                      size="sm"
                      className="h-7 flex-1"
                      onClick={() => updateSelectedText({ verticalAlign: true })}
                    >
                      <AlignVerticalJustifyStart className="size-3 rotate-0" />
                    </Button>
                    <Button
                      variant={getSelectedText()?.verticalAlign ? "outline" : "default"}
                      size="sm"
                      className="h-7 flex-1"
                      onClick={() => updateSelectedText({ verticalAlign: false })}
                    >
                      <AlignVerticalJustifyStart className="size-3 -rotate-90" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">文字色</label>
                  <div className="grid grid-cols-6 gap-1">
                    {["#000000", "#FF0000", "#0000FF", "#008000", "#FFA500", "#800080"].map(
                      (color) => (
                        <button
                          key={color}
                          className={cn(
                            "h-5 w-5 rounded-sm border border-gray-200",
                            getSelectedText()?.fill === color && "ring-2 ring-blue-500"
                          )}
                          style={{ backgroundColor: color }}
                          onClick={() => updateSelectedText({ fill: color })}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
