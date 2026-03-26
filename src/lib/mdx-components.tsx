import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="text-4xl sm:text-5xl font-bold text-white tracking-tight mt-10 mb-4"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-10 mb-4"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-xl sm:text-2xl font-semibold text-white mt-8 mb-3"
      {...props}
    />
  ),
  h4: (props) => (
    <h4 className="text-lg font-semibold text-white mt-6 mb-2" {...props} />
  ),
  p: (props) => (
    <p className="text-base text-white/75 leading-relaxed mb-5" {...props} />
  ),
  a: (props) => (
    <a
      className="text-brand hover:underline underline-offset-2"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="list-disc list-inside space-y-2 mb-5 text-white/75"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="list-decimal list-inside space-y-2 mb-5 text-white/75"
      {...props}
    />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-brand/40 pl-5 italic text-white/60 my-6"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-white/10 px-1.5 py-0.5 text-sm font-mono text-brand"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="rounded-xl bg-ink-08 border border-white/5 p-5 overflow-x-auto mb-5 text-sm"
      {...props}
    />
  ),
  hr: () => <hr className="border-white/10 my-10" />,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="rounded-xl my-6 max-w-full" alt="" {...props} />
  ),
  strong: (props) => (
    <strong className="font-semibold text-white" {...props} />
  ),
  table: (props) => (
    <div className="overflow-x-auto mb-5">
      <table
        className="w-full text-sm text-white/75 border-collapse"
        {...props}
      />
    </div>
  ),
  th: (props) => (
    <th
      className="text-left font-semibold text-white border-b border-white/10 px-3 py-2"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border-b border-white/5 px-3 py-2" {...props} />
  ),
};
