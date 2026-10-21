import { isValidElement, type ReactNode } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/blueprint/CodeBlock";
import { cn } from "@/lib/utils";

/** Flattens a rendered <code> element back to its source text. */
function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textOf(node.props.children);
  }
  return "";
}

function languageOf(node: ReactNode) {
  if (!isValidElement<{ className?: string }>(node)) return undefined;
  return /language-(\S+)/.exec(node.props.className ?? "")?.[1];
}

const components: Components = {
  h3: ({ children }) => (
    <h3 className="mt-10 mb-3 text-xl font-medium tracking-[-0.01em] text-ink">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="my-4 leading-[1.75] text-dim">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-medium text-ink">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-ink/85">{children}</em>,
  a: ({ href = "", children }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        className="break-words text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
      >
        {children}
      </a>
    );
  },
  ul: ({ className, children }) => (
    <ul
      className={cn(
        "my-4 flex flex-col gap-2 text-dim",
        className?.includes("contains-task-list")
          ? "list-none pl-0"
          : "list-disc pl-5 marker:text-accent"
      )}
    >
      {children}
    </ul>
  ),
  ol: ({ children, start }) => (
    <ol
      start={start}
      className="my-4 flex list-decimal flex-col gap-2 pl-5 text-dim marker:font-mono marker:text-[0.8em] marker:text-accent"
    >
      {children}
    </ol>
  ),
  li: ({ className, children }) => (
    <li
      className={cn(
        "leading-[1.75] [&>ol]:my-2 [&>ul]:my-2",
        className?.includes("task-list-item") && "flex items-start gap-3"
      )}
    >
      {children}
    </li>
  ),
  input: ({ type, checked }) =>
    type === "checkbox" ? (
      <input
        type="checkbox"
        checked={checked}
        readOnly
        disabled
        className="mt-[0.4em] h-4 w-4 shrink-0 cursor-default appearance-none rounded-[4px] border border-accent bg-transparent checked:bg-accent"
      />
    ) : null,
  code: ({ children }) => (
    <code className="rounded-[5px] border [box-decoration-break:clone] [-webkit-box-decoration-break:clone] border-line bg-surface px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <CodeBlock
      code={textOf(children).replace(/\n$/, "")}
      language={languageOf(children)}
    />
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-card border border-line">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-surface">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-line px-4 py-3 font-mono text-[0.68rem] font-normal uppercase tracking-[0.12em] text-dim">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-line px-4 py-3 align-top leading-relaxed text-dim [tr:last-child>&]:border-b-0">
      {children}
    </td>
  ),
  hr: () => null,
};

export function BlueprintMarkdown({
  children,
  overrides,
}: {
  children: string;
  overrides?: Components;
}) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={overrides ? { ...components, ...overrides } : components}
    >
      {children}
    </Markdown>
  );
}
