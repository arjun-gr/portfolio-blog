import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import remarkGfm from "remark-gfm"

const postsDirectory = path.join(process.cwd(), "blog-files")

export interface BlogPost {
  id: string
  title: string
  slug: string
  description: string
  content: string
  date: string
  readTime: string
  tags: string[]
  pinned: boolean
  featuredImage: string
  author: {
    name: string
    image: string
    bio: string
  }
}

// Helper function to add IDs to headings in HTML content
function addIdsToHeadings(content: string): string {
  if (!content) return ""

  return content.replace(/<h([2-6])>(.*?)<\/h([2-6])>/g, (match, level, text) => {
    const cleanText = text.replace(/<[^>]*>/g, "")
    let id = cleanText
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-")

    // Ensure ID starts with a letter (prefix with 'heading-' if it starts with a number)
    if (/^\d/.test(id)) {
      id = `heading-${id}`
    }

    // Ensure ID is not empty
    if (!id) {
      id = `heading-${level}-${Math.random().toString(36).substr(2, 9)}`
    }

    return `<h${level} id="${id}">${text}</h${level}>`
  })
}

// Simple HTML escape function
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// Simple syntax highlighting function
function highlightCode(code: string, language: string): string {
  const escapedCode = escapeHtml(code)

  switch (language.toLowerCase()) {
    case "javascript":
    case "js":
      return highlightJavaScript(escapedCode)
    case "typescript":
    case "ts":
      return highlightTypeScript(escapedCode)
    case "jsx":
    case "tsx":
      return highlightJSX(escapedCode)
    case "python":
    case "py":
      return highlightPython(escapedCode)
    case "css":
      return highlightCSS(escapedCode)
    case "html":
      return highlightHTML(escapedCode)
    case "json":
      return highlightJSON(escapedCode)
    default:
      return escapedCode
  }
}

function highlightJavaScript(code: string): string {
  return code
    .replace(
      /\b(const|let|var|function|return|if|else|for|while|do|break|continue|switch|case|default|try|catch|finally|throw|new|this|class|extends|import|export|from|as|async|await|yield|typeof|instanceof)\b/g,
      '<span class="keyword">$1</span>',
    )
    .replace(/\b(true|false|null|undefined|NaN|Infinity)\b/g, '<span class="literal">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
    .replace(/(&#39;|&quot;)((?:(?!\1)[^&]|&(?!#39;|quot;))*?)\1/g, '<span class="string">$1$2$1</span>')
    .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
    .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
    .replace(
      /\b(console|document|window|Array|Object|String|Number|Boolean|Date|Math|JSON|Promise|setTimeout|setInterval|clearTimeout|clearInterval)\b/g,
      '<span class="builtin">$1</span>',
    )
}

function highlightTypeScript(code: string): string {
  return highlightJavaScript(code).replace(
    /\b(interface|type|enum|namespace|declare|abstract|implements|private|public|protected|readonly|static)\b/g,
    '<span class="keyword">$1</span>',
  )
}

function highlightJSX(code: string): string {
  return highlightJavaScript(code)
    .replace(/(&lt;\/?)([A-Z][A-Za-z0-9]*)/g, '$1<span class="jsx-tag">$2</span>')
    .replace(/\b([a-z]+)=/g, '<span class="jsx-attr">$1</span>=')
}

function highlightPython(code: string): string {
  return code
    .replace(
      /\b(def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|break|continue|pass|raise|assert|global|nonlocal|lambda|and|or|not|in|is)\b/g,
      '<span class="keyword">$1</span>',
    )
    .replace(/\b(True|False|None)\b/g, '<span class="literal">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
    .replace(/(&#39;|&quot;)((?:(?!\1)[^&]|&(?!#39;|quot;))*?)\1/g, '<span class="string">$1$2$1</span>')
    .replace(/#.*$/gm, '<span class="comment">$&</span>')
    .replace(
      /\b(print|len|range|enumerate|zip|map|filter|sorted|sum|max|min|abs|round|int|float|str|list|dict|set|tuple)\b/g,
      '<span class="builtin">$1</span>',
    )
}

function highlightCSS(code: string): string {
  return code
    .replace(/([.#]?[a-zA-Z-]+)\s*{/g, '<span class="selector">$1</span> {')
    .replace(/([a-zA-Z-]+):/g, '<span class="property">$1</span>:')
    .replace(/:\s*([^;]+);/g, ': <span class="value">$1</span>;')
    .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
}

function highlightHTML(code: string): string {
  return code
    .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)/g, '$1<span class="tag">$2</span>')
    .replace(/([a-zA-Z-]+)=/g, '<span class="attr">$1</span>=')
    .replace(/(&#39;|&quot;)((?:(?!\1)[^&]|&(?!#39;|quot;))*?)\1/g, '<span class="string">$1$2$1</span>')
}

function highlightJSON(code: string): string {
  return code
    .replace(/(&#39;|&quot;)((?:(?!\1)[^&]|&(?!#39;|quot;))*?)\1:/g, '<span class="key">$1$2$1</span>:')
    .replace(/:\s*(&#39;|&quot;)((?:(?!\1)[^&]|&(?!#39;|quot;))*?)\1/g, ': <span class="string">$1$2$1</span>')
    .replace(/:\s*(\d+\.?\d*)/g, ': <span class="number">$1</span>')
    .replace(/:\s*(true|false|null)/g, ': <span class="literal">$1</span>')
}

// Helper function to process code blocks with custom styling
function processCodeBlocks(content: string): string {
  if (!content) return ""

  // Handle fenced code blocks with language specification
  content = content.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, (match, language, code) => {
    const decodedCode = code
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")

    const highlightedCode = highlightCode(decodedCode, language)

    return `<div class="code-block-wrapper" data-language="${language}">
        <div class="code-block-header">
          <span class="code-block-language">${language}</span>
          <button class="copy-code-btn" data-code="${escapeHtml(decodedCode)}" title="Copy code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
        <pre class="code-block"><code class="language-${language}">${highlightedCode}</code></pre>
      </div>`
  })

  // Handle fenced code blocks without language specification
  content = content.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (match, code) => {
    const decodedCode = code
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")

    return `<div class="code-block-wrapper" data-language="text">
        <div class="code-block-header">
          <span class="code-block-language">code</span>
          <button class="copy-code-btn" data-code="${escapeHtml(decodedCode)}" title="Copy code">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
        <pre class="code-block"><code>${escapeHtml(decodedCode)}</code></pre>
      </div>`
  })

  // Handle inline code
  content = content.replace(/<code>([^<]+)<\/code>/g, '<code class="inline-code">$1</code>')

  return content
}

// Get all blog post files
function getBlogPostFiles(): string[] {
  try {
    return fs.readdirSync(postsDirectory).filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
  } catch (error) {
    console.warn("Blog files directory not found, returning empty array")
    return []
  }
}

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const fileNames = getBlogPostFiles()

  if (fileNames.length === 0) {
    console.warn("No blog files found")
    return []
  }

  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, "")
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")

      const matterResult = matter(fileContents)

      const processedContent = await remark()
        .use(remarkGfm)
        .use(html, { sanitize: false })
        .process(matterResult.content)

      let contentHtml = processedContent.toString()
      contentHtml = addIdsToHeadings(contentHtml)
      contentHtml = processCodeBlocks(contentHtml)

      return {
        id: slug,
        slug,
        content: contentHtml,
        title: matterResult.data.title || "Untitled",
        description: matterResult.data.description || "",
        date: matterResult.data.date || "",
        readTime: matterResult.data.readTime || "5 min read",
        tags: matterResult.data.tags || [],
        pinned: matterResult.data.pinned || false,
        featuredImage: matterResult.data.featuredImage || "/placeholder.svg?height=400&width=800",
        author: matterResult.data.author || {
          name: "Arjun Patel",
          image: "/placeholder.svg?height=100&width=100",
          bio: "Software Engineer & Tech Blogger",
        },
      } as BlogPost
    }),
  )

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Try .mdx first, then .md
    let fullPath = path.join(postsDirectory, `${slug}.mdx`)
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(postsDirectory, `${slug}.md`)
      if (!fs.existsSync(fullPath)) {
        return null
      }
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const matterResult = matter(fileContents)

    const processedContent = await remark().use(remarkGfm).use(html, { sanitize: false }).process(matterResult.content)

    let contentHtml = processedContent.toString()
    contentHtml = addIdsToHeadings(contentHtml)
    contentHtml = processCodeBlocks(contentHtml)

    return {
      id: slug,
      slug,
      content: contentHtml,
      title: matterResult.data.title || "Untitled",
      description: matterResult.data.description || "",
      date: matterResult.data.date || "",
      readTime: matterResult.data.readTime || "5 min read",
      tags: matterResult.data.tags || [],
      pinned: matterResult.data.pinned || false,
      featuredImage: matterResult.data.featuredImage || "/placeholder.svg?height=400&width=800",
      author: matterResult.data.author || {
        name: "Arjun Patel",
        image: "/placeholder.svg?height=100&width=100",
        bio: "Software Engineer & Tech Blogger",
      },
    } as BlogPost
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error)
    return null
  }
}

// Get all unique tags from blog posts
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllBlogPosts()
  const tagsSet = new Set<string>(["All"])

  posts.forEach((post) => {
    post.tags.forEach((tag) => tagsSet.add(tag))
  })

  return Array.from(tagsSet)
}

// Get posts by tag
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts()

  if (tag === "All") {
    return posts
  }

  return posts.filter((post) => post.tags.includes(tag))
}

// Search posts by title or content
export async function searchPosts(query: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts()
  const lowercaseQuery = query.toLowerCase()

  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.description.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}
