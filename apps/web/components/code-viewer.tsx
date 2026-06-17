"use client";

import { Highlight, themes } from "prism-react-renderer";
import { cn } from "@/lib/utils";

type CodeViewerProps = {
  value: unknown;
  className?: string;
};

export function CodeViewer({
  value,
  className,
}: CodeViewerProps): React.ReactElement {
  const code = JSON.stringify(value, null, 2);

  return (
    <div
      className={cn(
        "h-full overflow-auto rounded-lg bg-slate-950 p-4 font-mono text-[13px] leading-6",
        className,
      )}
    >
      <Highlight theme={themes.nightOwl} code={code} language="json">
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre aria-label="Read-only JSON">
            {tokens.map((line, index) => (
              <div key={index} {...getLineProps({ line })}>
                <span className="mr-4 inline-block w-6 select-none text-right text-slate-600">
                  {index + 1}
                </span>
                {line.map((token, tokenIndex) => (
                  <span key={tokenIndex} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
