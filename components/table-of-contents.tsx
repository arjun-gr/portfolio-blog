"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>("")

  // Extract headings from the actual DOM after content is rendered
  useEffect(() => {
    const extractHeadingsFromDOM = () => {
      // Wait a bit for the content to be fully rendered
      setTimeout(() => {
        const headingElements = document.querySelectorAll("article h2, article h3, article h4")
        const extractedHeadings: Heading[] = []

        headingElements.forEach((element) => {
          const level = Number.parseInt(element.tagName.charAt(1))
          const text = element.textContent || ""
          const id = element.id

          if (id && text) {
            extractedHeadings.push({ id, text, level })
          }
        })

        console.log("Extracted headings:", extractedHeadings) // Debug log
        setHeadings(extractedHeadings)
      }, 100)
    }

    if (content) {
      extractHeadingsFromDOM()
    }
  }, [content])

  // Track active heading on scroll
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-100px 0px -80% 0px",
        threshold: 0.1,
      },
    )

    // Observe the actual heading elements
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [headings])

  const handleClick = (headingId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    console.log("Clicking on heading:", headingId) // Debug log

    const element = document.getElementById(headingId)
    console.log("Found element:", element) // Debug log

    if (element) {
      // Calculate offset for fixed header
      const headerOffset = 100 // Adjust this value based on your header height
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })

      // Update URL hash
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${headingId}`)
      }

      // Update active state immediately
      setActiveId(headingId)
    } else {
      console.error("Element not found:", headingId)
    }
  }

  if (headings.length === 0) {
    return (
      <div className="hidden lg:block sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto pb-10">
        <div className="mb-4 text-sm font-medium text-muted-foreground">Loading table of contents...</div>
      </div>
    )
  }

  return (
    <div className="hidden lg:block sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto pb-10">
      <div className="mb-4 text-sm font-medium text-foreground">Table of Contents</div>
      <nav>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={cn(
                "transition-colors",
                heading.level === 2 ? "ml-0" : heading.level === 3 ? "ml-4" : "ml-8",
                activeId === heading.id ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <button
                type="button"
                onClick={(e) => handleClick(heading.id, e)}
                className="inline-block py-1 hover:text-primary transition-colors text-left w-full cursor-pointer"
                title={`Go to ${heading.text}`}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
