import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getAllBlogPosts, getAllTags } from "@/lib/blog"
import BlogPageFilter from "@/components/blog-page-filter"

export const revalidate = 3600 // Revalidate this page every hour

export default async function Blog() {
  // Fetch blog posts and tags from markdown files
  const [blogPosts, allTags] = await Promise.all([getAllBlogPosts(), getAllTags()])

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
        {/* Blog Header */}
        <section className="py-12 text-center">
          <Link href="/" className="inline-flex items-center text-sm hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials, and insights on web development, AI, and the tech industry.
          </p>
        </section>

        {/* Blog Filter and Posts */}
        <BlogPageFilter blogPosts={blogPosts} allTags={allTags} />

        {/* Newsletter Signup */}
        <section className="py-12 bg-muted rounded-xl p-8 mt-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Subscribe to my newsletter</h2>
            <p className="text-muted-foreground mb-6">
              Get the latest articles and insights delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="rounded-full">Subscribe</Button>
            </div>
          </div>
        </section>
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
