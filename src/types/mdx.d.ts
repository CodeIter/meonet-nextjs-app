declare module '*.mdx' {

  // Use unknown if you want to allow any type
  // but still enforce type checks.
  //type MDXProps<T = unknown> = T

  // Use object if you want to restrict the props to be objects only.
  type MDXProps<T extends object = object> = T

  let MDXComponent: (props: MDXProps) => JSX.Element

  export default MDXComponent;

}
