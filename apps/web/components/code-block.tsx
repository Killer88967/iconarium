"use client";

import { useState } from "react";
import Icon from "@/components/icon";

interface CodeBlockProps {
  children: string;
  label?: string;
  className?: string;
  icon: React.ReactNode;
}

export default function CodeBlock({
  children,
  label,
  className,
  icon,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(children);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div className={`code-block${className ? ` ${className}` : ""}`}>
      <div className="code-block-header">
        <span className="code-block-label">
          {icon}
          <span>{label ?? "Code"}</span>
        </span>

        <button
          type="button"
          className="code-block-copy"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          <Icon name={copied ? "check" : "copy"} size={16} />
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}
