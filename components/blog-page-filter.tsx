"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { BlogPost } from "@/lib/blog"

interface BlogPageFilterProps {
  blogPosts: BlogPost[]
  allTags: string[]
}

export default function BlogPageFilter({ blogPosts, allTags }: BlogPageFilterProps) {
  const [selectedTag, setSelectedTag] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Filter posts based on selected tag and search query
  const filteredPosts = blogPosts.filter((post) => {
    const matchesTag = selectedTag === "All" || post.tags.includes(selectedTag)
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesTag && matchesSearch
  })

  // Separate pinned and regular posts
  const pinnedPosts = filteredPosts.filter((post) => post.pinned)
  const regularPosts = filteredPosts.filter((post) => !post.pinned)

  return (
    <>
      {/* Search Bar */}
      <section className="mb-8">
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </section>

      {/* Filter by Tags */}
      <section className="py-8 border-t border-b border-border">
        <h2 className="text-2xl font-bold mb-4">Filter by Tags</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={tag === selectedTag ? "default" : "outline"}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
        {(selectedTag !== "All" || searchQuery) && (
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
            {selectedTag !== "All" && ` tagged with "${selectedTag}"`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        )}
      </section>

      {/* Featured Posts */}
      {pinnedPosts.length > 0 && (
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-8">Featured Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pinnedPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <CardHeader className="p-0">
                    <div className="h-64 bg-muted relative">
                      <Image
                        src={post.featuredImage || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-muted-foreground">{post.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="text-sm text-muted-foreground">
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      Read more
                    </Button>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* All Blog Posts */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8">{pinnedPosts.length > 0 ? "All Articles" : "Articles"}</h2>
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? `No posts found matching "${searchQuery}"`
                : selectedTag !== "All"
                  ? `No posts found for tag "${selectedTag}"`
                  : "No blog posts found."}
            </p>
            <div className="flex gap-2 justify-center">
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")} className="rounded-full">
                  Clear Search
                </Button>
              )}
              {selectedTag !== "All" && (
                <Button variant="outline" onClick={() => setSelectedTag("All")} className="rounded-full">
                  Show All Posts
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <CardHeader className="p-0">
                    <div className="h-48 bg-muted relative">
                      <Image
                        src={post.featuredImage || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-muted-foreground line-clamp-2">{post.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="text-sm text-muted-foreground">
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      Read more
                    </Button>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
