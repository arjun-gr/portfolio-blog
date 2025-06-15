import { mdxComponents } from "./components/mdx-components"

export function useMDXComponents(components) {
  return {
    ...mdxComponents,
    ...components,
  }
}
