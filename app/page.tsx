import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Github, Linkedin, Twitter, Youtube, Instagram } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getAllBlogPosts, getAllTags } from "@/lib/blog"
import BlogFilter from "@/components/blog-filter"

export const revalidate = 3600 // Revalidate this page every hour

export default async function Home() {
  // Fetch blog posts and tags from markdown files
  const [blogPosts, allTags] = await Promise.all([getAllBlogPosts(), getAllTags()])

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="font-bold text-xl">Arjun.dev</div>
        <nav className="hidden md:flex space-x-6">
          <Link href="#" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Projects
          </Link>
          <Link href="/blog" className="hover:text-primary transition-colors">
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
        {/* Hero Section */}
        <section className="py-12 md:py-20 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2 flex justify-center md:justify-end order-1 md:order-2">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl transition-transform hover:scale-105 duration-300">
              <Image
                src="/me.png?height=320&width=320"
                alt="Arjun Gahatraj"
                width={320}
                height={320}
                className="object-cover"
                priority
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-6 text-center md:text-left order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-primary">Hello, I'm Arjun.</span>
              <br />
              Software Engineer & Writer.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto md:mx-0">
              I build accessible, inclusive products and write about web development, AI, and tech trends.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button size="lg" className="rounded-full">
                Explore Projects
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                About Me
              </Button>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-4 justify-center md:justify-start pt-4">
              <Link href="#" className="bg-muted hover:bg-primary/10 p-3 rounded-full transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="bg-muted hover:bg-primary/10 p-3 rounded-full transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="bg-muted hover:bg-primary/10 p-3 rounded-full transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="bg-muted hover:bg-primary/10 p-3 rounded-full transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
              <Link href="#" className="bg-muted hover:bg-primary/10 p-3 rounded-full transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Filter and Posts */}
        <BlogFilter blogPosts={blogPosts} allTags={allTags} />
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Arjun . All rights reserved.</p>
          <p className="mt-2 text-sm">Built with Next.js, Tailwind CSS, and ❤️</p>
        </div>
      </footer>
    </div>
  )
}
