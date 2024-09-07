/* eslint-disable jsx-a11y/alt-text */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Transformer } from "react-konva";
import useImage from "use-image";
import useModelStore from "@/store/useStore";

export default function ImageKonva() {
  const { setImage } = useModelStore();
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageX, setImageX] = useState(0);
  const [imageY, setImageY] = useState(0);
  const stageRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [rotation, setRotation] = useState(0);

  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
    setOpen(true);
    setImage(true)
  };

  const handleImageInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          const newWidth = 150;
          const newHeight = newWidth / aspectRatio;
          setImageWidth(newWidth);
          setImageHeight(newHeight);
          setImageX((300 - newWidth) / 2);
          setImageY((300 - newHeight) / 2);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const KonvaImage = ({
    uploadedImage,
    imageX,
    imageY,
    imageWidth,
    imageHeight,
    setImageX,
    setImageY,
    rotation,
    setRotation,
    isSelected,
    onSelect,
    onTransformEnd,
  }) => {
    const [img] = useImage(uploadedImage);
    const imageRef = useRef(null);
    const transformerRef = useRef(null);

    useEffect(() => {
      if (isSelected) {
        transformerRef.current.nodes([imageRef.current]);
        transformerRef.current.getLayer().batchDraw();
      }
    }, [isSelected]);

    return (
      <>
        <Image
          image={img}
          x={imageX}
          y={imageY}
          width={imageWidth}
          height={imageHeight}
          draggable
          ref={imageRef}
          onClick={onSelect}
          onTap={onSelect}
          rotation={rotation}
          onDragEnd={(e) => {
            setImageX(e.target.x());
            setImageY(e.target.y());
          }}
          onTransformEnd={(e) => {
            const node = imageRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);

            setImageX(node.x());
            setImageY(node.y());
            setRotation(node.rotation());
            onTransformEnd({
              width: node.width() * scaleX,
              height: node.height() * scaleY,
            });
          }}
        />
        {isSelected && (
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 20 || newBox.height < 20) {
                return oldBox;
              }
              return newBox;
            }}
          />
        )}
      </>
    );
  };
  return (
    <div className="block">
      <button
        className="flex justify-center items-center gap-1 border border-zinc-100 p-1 rounded-md"
        onClick={handleButtonClick}
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          className="hidden lg:flex"
          viewBox="0 0 24 24"
          focusable="false"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 5h13v7h2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h8v-2H4V5z"></path>
          <path d="m8 11-3 4h11l-4-6-3 4z"></path>
          <path d="M19 14h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path>
        </svg>
        <p>Load Image</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageInput}
          accept="image/*"
          className="hidden"
        />
      </button>

      <div
        className={`lg:relative lg:pt-2 ${
          open ? "flex" : "hidden"
        } transition-all duration-700 ease-in-out `}
      >
        <div class="relative  bg-slate-950 rounded">
          <div className="relative z-20">
            <Stage
            
              width={300}
              height={300}
              ref={stageRef}
              className=" z-20"
              onClick={handleStageClick}
              onTap={handleStageClick}
            >
              <Layer>
                <KonvaImage
                  uploadedImage={uploadedImage}
                  imageX={imageX}
                  imageY={imageY}
                  imageWidth={imageWidth}
                  imageHeight={imageHeight}
                  setImageX={setImageX}
                  setImageY={setImageY}
                  rotation={rotation}
                  setRotation={setRotation}
                  isSelected={selectedId === "image"}
                  onSelect={() => {
                    setSelectedId("image");
                  }}
                  onTransformEnd={({ width, height }) => {
                    setImageWidth(width);
                    setImageHeight(height);
                  }}
                />
              </Layer>
            </Stage>
          </div>
          <div class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none "></div>
        </div>
      </div>
      
    </div>
  );
}