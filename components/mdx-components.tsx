import type { MDXComponents } from "mdx/types"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Custom components for MDX
export const mdxComponents: MDXComponents = {
  // Override default elements
  h1: ({ children, ...props }) => (
    <h1 className="text-4xl font-bold mt-8 mb-4 text-foreground" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }) => (
    <h2 id={id} className="text-3xl font-bold mt-12 mb-6 text-foreground scroll-mt-20" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }) => (
    <h3 id={id} className="text-2xl font-bold mt-10 mb-4 text-foreground scroll-mt-20" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, id, ...props }) => (
    <h4 id={id} className="text-xl font-bold mt-8 mb-3 text-foreground scroll-mt-20" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p className="text-foreground leading-7 mb-6" {...props}>
      {children}
    </p>
  ),
  a: ({ children, href, ...props }) => (
    <Link href={href || "#"} className="text-primary hover:text-primary/80 underline" {...props}>
      {children}
    </Link>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc pl-6 mb-6 space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal pl-6 mb-6 space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="text-foreground" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-primary pl-6 italic my-6 text-muted-foreground" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ children, className, ...props }) => {
    // Inline code
    if (!className) {
      return (
        <code
          className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      )
    }

    // Block code (handled by rehype-highlight)
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }) => (
    <div className="code-block-wrapper my-6">
      <pre className="code-block overflow-x-auto p-4 rounded-lg" {...props}>
        {children}
      </pre>
    </div>
  ),
  img: ({ src, alt, ...props }) => (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt || ""}
      width={800}
      height={400}
      className="rounded-lg my-6"
      {...props}
    />
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse border border-border" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th className="border border-border bg-muted px-4 py-2 text-left font-medium" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-border px-4 py-2" {...props}>
      {children}
    </td>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-bold text-foreground" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-foreground" {...props}>
      {children}
    </em>
  ),
  // Custom components that can be used in MDX
  Button: ({ children, ...props }) => <Button {...props}>{children}</Button>,
}

// Export for use in MDX files
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  }
}
