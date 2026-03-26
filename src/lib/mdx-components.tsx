import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="text-4xl sm:text-5xl font-bold text-ink-08 tracking-tight mt-10 mb-4"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="text-2xl sm:text-3xl font-bold text-ink-08 tracking-tight mt-10 mb-4"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-xl sm:text-2xl font-semibold text-ink-08 mt-8 mb-3"
      {...props}
    />
  ),
  h4: (props) => (
    <h4 className="text-lg font-semibold text-ink-08 mt-6 mb-2" {...props} />
  ),
  p: (props) => (
    <p className="text-base text-ink-05 leading-relaxed mb-5" {...props} />
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
      className="list-disc list-inside space-y-2 mb-5 text-ink-05"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="list-decimal list-inside space-y-2 mb-5 text-ink-05"
      {...props}
    />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-brand/40 pl-5 italic text-ink-05/70 my-6"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-black/5 px-1.5 py-0.5 text-sm font-mono text-brand"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="rounded-xl bg-ink-08 border border-white/5 p-5 overflow-x-auto mb-5 text-sm text-white"
      {...props}
    />
  ),
  hr: () => <hr className="border-black/10 my-10" />,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="rounded-xl my-6 max-w-full" alt="" {...props} />
  ),
  strong: (props) => (
    <strong className="font-semibold text-ink-08" {...props} />
  ),
  table: (props) => (
    <div className="overflow-x-auto mb-5">
      <table
        className="w-full text-sm text-ink-05 border-collapse"
        {...props}
      />
    </div>
  ),
  th: (props) => (
    <th
      className="text-left font-semibold text-ink-08 border-b border-black/10 px-3 py-2"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border-b border-black/5 px-3 py-2" {...props} />
  ),
};
