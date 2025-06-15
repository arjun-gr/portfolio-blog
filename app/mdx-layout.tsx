import type { ReactNode } from "react"

interface MDXLayoutProps {
  children: ReactNode
}

export default function MDXLayout({ children }: MDXLayoutProps) {
  return <div className="prose prose-lg dark:prose-invert max-w-none">{children}</div>
}
