"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { BlogPost } from "@/lib/blog"

interface BlogFilterProps {
  blogPosts: BlogPost[]
  allTags: string[]
}

export default function BlogFilter({ blogPosts, allTags }: BlogFilterProps) {
  const [selectedTag, setSelectedTag] = useState<string>("All")

  // Filter posts based on selected tag
  const filteredPosts = selectedTag === "All" ? blogPosts : blogPosts.filter((post) => post.tags.includes(selectedTag))

  return (
    <>
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
        {selectedTag !== "All" && (
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""} tagged with "{selectedTag}"
          </div>
        )}
      </section>

      {/* Blog Posts */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8">
          {selectedTag === "All" ? "Latest Articles" : `Articles tagged "${selectedTag}"`}
        </h2>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No posts found for the selected tag.</p>
            <Button variant="outline" onClick={() => setSelectedTag("All")} className="rounded-full">
              Show All Posts
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.slice(0, 6).map((post) => (
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
                      {post.pinned && (
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground p-1.5 rounded-full">
                          <Pin className="h-4 w-4" />
                        </div>
                      )}
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
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      Read more
                    </Button>
                  </CardFooter>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {/* Show more button if there are more posts */}
        {filteredPosts.length > 6 && (
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/blog">View All {filteredPosts.length} Posts</Link>
            </Button>
          </div>
        )}
      </section>
    </>
  )
}
