"use client"

import { useMemo, useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import {
  Counter,
  Fullscreen,
  Thumbnails,
  Zoom,
} from "yet-another-react-lightbox/plugins"

import { getImageUrl } from "@/lib/utils"

type TeamPhotoGalleryProps = {
  photos: string[]
}

export function TeamPhotoGallery({ photos }: TeamPhotoGalleryProps) {
  const [index, setIndex] = useState(-1)
  const images = useMemo(
    () => photos.map((photo) => getImageUrl(photo)).filter(Boolean) as string[],
    [photos]
  )
  const visibleImages = images.slice(0, 3)
  const remainingCount = Math.max(0, images.length - visibleImages.length)

  if (images.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Chưa cập nhật hình ảnh đội ngũ.
      </p>
    )
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        {visibleImages.map((photo, photoIndex) => {
          const isLastVisible = photoIndex === visibleImages.length - 1

          return (
            <button
              key={`${photo}-${photoIndex}`}
              className="group relative aspect-video overflow-hidden rounded-md bg-muted text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              onClick={() => setIndex(photoIndex)}
              type="button"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={`Team photo ${photoIndex + 1}`}
                className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                src={photo}
              />
              {isLastVisible && remainingCount > 0 ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-2xl font-semibold text-white">
                  +{remainingCount}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <Lightbox
        close={() => setIndex(-1)}
        index={index}
        open={index >= 0}
        plugins={[Counter, Fullscreen, Thumbnails, Zoom]}
        slides={images.map((src) => ({
          download: src,
          src,
          thumbnail: src,
        }))}
        thumbnails={{
          borderRadius: 6,
          gap: 8,
          height: 72,
          position: "bottom",
          showToggle: true,
          width: 112,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
      />
    </>
  )
}
