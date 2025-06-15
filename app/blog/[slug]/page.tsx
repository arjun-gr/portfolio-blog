import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog"
import { notFound } from "next/navigation"
import BlogPostClient from "./BlogPostClient"

interface BlogPostPageProps {
  params: { slug: string }
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return <BlogPostClient post={post} />
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.featuredImage],
    },
  }
}
