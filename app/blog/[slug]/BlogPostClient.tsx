"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { TableOfContents } from "@/components/table-of-contents"
import { useEffect } from "react"
import type { BlogPost } from "@/lib/blog"

interface BlogPostClientProps {
  post: BlogPost
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  // Add copy code functionality
  useEffect(() => {
    const handleCopyClick = (event: Event) => {
      const button = event.target as HTMLElement
      const copyBtn = button.closest(".copy-code-btn") as HTMLButtonElement

      if (copyBtn) {
        const code = copyBtn.getAttribute("data-code")
        if (code) {
          navigator.clipboard
            .writeText(code)
            .then(() => {
              // Show feedback
              const originalHTML = copyBtn.innerHTML
              copyBtn.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            `
              copyBtn.style.color = "#4ade80"
              setTimeout(() => {
                copyBtn.innerHTML = originalHTML
                copyBtn.style.color = ""
              }, 2000)
            })
            .catch(() => {
              console.error("Failed to copy code")
            })
        }
      }
    }

    // Add event listeners to all copy buttons
    const copyButtons = document.querySelectorAll(".copy-code-btn")
    copyButtons.forEach((button) => {
      button.addEventListener("click", handleCopyClick)
    })

    // Cleanup
    return () => {
      copyButtons.forEach((button) => {
        button.removeEventListener("click", handleCopyClick)
      })
    }
  }, [])

  // Handle URL hash on page load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash.substring(1))
          if (element) {
            const headerOffset = 100
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            })
          }
        }, 500) // Wait for content to render
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="font-bold text-xl">Arjun.dev</div>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Projects
          </Link>
          <Link href="/blog" className="text-primary transition-colors">
            Blog
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            About
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>
        <ModeToggle />
      </header>

      <main className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <Link href="/blog" className="inline-flex items-center text-sm hover:text-primary mb-8 mt-8">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Blog
          </Link>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Table of Contents - Left Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <TableOfContents content={post.content || ""} />
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags &&
                  post.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

              {/* Meta Info */}
              <div className="flex items-center gap-6 mb-8 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Image
                    src={post.author?.image || "/placeholder.svg"}
                    alt={post.author?.name || "Author"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span>{post.author?.name || "Author"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Featured Image */}
              {post.featuredImage && (
                <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden">
                  <Image
                    src={post.featuredImage || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <article
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Share */}
              <div className="mt-12 pt-8 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Share this article</h3>
                  <div className="flex gap-4">
                    <Button size="icon" variant="outline" className="rounded-full">
                      <Share2 className="h-4 w-4" />
                      <span className="sr-only">Share</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Author Bio */}
              <div className="mt-12 p-6 bg-muted rounded-xl">
                <div className="flex items-center gap-4">
                  <Image
                    src={post.author?.image || "/placeholder.svg"}
                    alt={post.author?.name || "Author"}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{post.author?.name || "Author"}</h3>
                    <p className="text-muted-foreground">{post.author?.bio || "Software Engineer & Tech Blogger"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Arjun Gr. All rights reserved.</p>
          <p className="mt-2 text-sm">Built with Next.js, Tailwind CSS, and ❤️</p>
        </div>
      </footer>
    </div>
  )
}
