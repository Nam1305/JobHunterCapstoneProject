"use client"

import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react"
import { Document, Page, pdfjs } from "react-pdf"
import type { PDFDocumentProxy } from "pdfjs-dist"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString()

interface CandidatePdfPreviewProps {
  fileUrl: string
}

const MIN_ZOOM = 0.75
const MAX_ZOOM = 1.75
const ZOOM_STEP = 0.25

export default function CandidatePdfPreview({
  fileUrl,
}: CandidatePdfPreviewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = React.useState(0)
  const [numPages, setNumPages] = React.useState(0)
  const [pageNumber, setPageNumber] = React.useState(1)
  const [zoom, setZoom] = React.useState(1)

  React.useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })

    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  const handleLoadSuccess = ({ numPages }: PDFDocumentProxy) => {
    setNumPages(numPages)
    setPageNumber(1)
  }

  const handlePreviousPage = () => {
    setPageNumber((current) => Math.max(current - 1, 1))
  }

  const handleNextPage = () => {
    setPageNumber((current) => Math.min(current + 1, numPages))
  }

  const handleZoomOut = () => {
    setZoom((current) => Math.max(current - ZOOM_STEP, MIN_ZOOM))
  }

  const handleZoomIn = () => {
    setZoom((current) => Math.min(current + ZOOM_STEP, MAX_ZOOM))
  }

  const isCompactToolbar = containerWidth > 0 && containerWidth < 640
  const currentPageLabel = `Trang ${numPages ? pageNumber : "-"} / ${numPages || "-"}`
  const zoomLabel = `${Math.round(zoom * 100)}%`

  return (
    <div className="bg-background">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/40 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
          <FileTextIcon className="size-4 shrink-0" />
          <span className="truncate">CV ứng viên</span>
        </div>
        <div
          className={
            isCompactToolbar
              ? "hidden"
              : "flex flex-wrap items-center justify-end gap-2"
          }
        >
          <div className="min-w-20 text-muted-foreground">
            {currentPageLabel}
          </div>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handlePreviousPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeftIcon />
            <span className="sr-only">Trang trước</span>
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleNextPage}
            disabled={!numPages || pageNumber >= numPages}
          >
            <ChevronRightIcon />
            <span className="sr-only">Trang tiếp theo</span>
          </Button>
          <div className="mx-1 h-5 w-px bg-border" />
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleZoomOut}
            disabled={zoom <= MIN_ZOOM}
          >
            <ZoomOutIcon />
            <span className="sr-only">Thu nhỏ</span>
          </Button>
          <div className="min-w-12 text-center text-muted-foreground">
            {zoomLabel}
          </div>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleZoomIn}
            disabled={zoom >= MAX_ZOOM}
          >
            <ZoomInIcon />
            <span className="sr-only">Phóng to</span>
          </Button>
          <div className="mx-1 h-5 w-px bg-border" />
          <Button variant="outline" size="sm" asChild>
            <a href={fileUrl} download>
              <DownloadIcon />
              Tải xuống
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={fileUrl} target="_blank" rel="noreferrer">
              <ExternalLinkIcon />
              Mở rộng
            </a>
          </Button>
        </div>
        {isCompactToolbar ? (
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground">{currentPageLabel}</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-sm">
                  <MoreHorizontalIcon />
                  <span className="sr-only">Mở menu xem CV</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onSelect={handlePreviousPage}
                  disabled={pageNumber <= 1}
                >
                  <ChevronLeftIcon />
                  Trang trước
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={handleNextPage}
                  disabled={!numPages || pageNumber >= numPages}
                >
                  <ChevronRightIcon />
                  Trang tiếp theo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={handleZoomOut}
                  disabled={zoom <= MIN_ZOOM}
                >
                  <ZoomOutIcon />
                  Thu nhỏ
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={handleZoomIn}
                  disabled={zoom >= MAX_ZOOM}
                >
                  <ZoomInIcon />
                  Phóng to
                  <span className="ml-auto text-muted-foreground">
                    {zoomLabel}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href={fileUrl} download>
                    <DownloadIcon />
                    Tải xuống
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={fileUrl} target="_blank" rel="noreferrer">
                    <ExternalLinkIcon />
                    Mở rộng
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}
      </div>

      <div ref={containerRef} className="bg-muted/20 p-4">
        <Document
          file={fileUrl}
          onLoadSuccess={handleLoadSuccess}
          loading={
            <div className="flex h-full min-h-80 items-center justify-center text-muted-foreground">
              Đang tải CV...
            </div>
          }
          error={
            <div className="flex h-full min-h-80 items-center justify-center text-muted-foreground">
              Không thể hiển thị CV.
            </div>
          }
          className="flex min-h-80 justify-center"
        >
          <Page
            pageNumber={pageNumber}
            width={containerWidth || 640}
            scale={zoom}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            loading={
              <div className="flex h-full min-h-80 items-center justify-center text-muted-foreground">
                Đang tải trang...
              </div>
            }
            error={
              <div className="flex h-full min-h-80 items-center justify-center text-muted-foreground">
                Không thể hiển thị trang này.
              </div>
            }
            className="overflow-hidden rounded-md shadow-sm [&_canvas]:mx-auto"
          />
        </Document>
      </div>
    </div>
  )
}
