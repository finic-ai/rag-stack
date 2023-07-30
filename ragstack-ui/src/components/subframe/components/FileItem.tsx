"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface FileItemRootProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  name?: string;
  imagePreview?: React.ReactNode;
  className?: string;
}

const FileItemRoot = React.forwardRef<HTMLElement, FileItemRootProps>(
  function FileItemRoot(
    {
      selected = false,
      name = "claim_1.pdf",
      imagePreview,
      className,
      ...otherProps
    }: FileItemRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex rounded flex-col gap-2 items-start cursor-pointer group/061250c5",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div
          className={SubframeCore.twClassNames(
            "flex border-2 border-solid border-neutral-border rounded flex-col gap-2 items-start group-hover/061250c5:border-2 group-hover/061250c5:border-solid group-hover/061250c5:border-neutral-300",
            { "border-2 border-solid border-brand-600": selected }
          )}
        >
          {imagePreview !== undefined ? (
            imagePreview
          ) : (
            <img
              className="flex-none h-32 w-32"
              src="https://res.cloudinary.com/demo/image/upload/v1690586358/CleanShot_2023-07-28_at_16.18.55_xu6nn0.png"
            />
          )}
        </div>
        {name ? (
          <span
            className={SubframeCore.twClassNames(
              "text-body font-body text-default-font",
              { "text-body-bold font-body-bold": selected }
            )}
          >
            {name}
          </span>
        ) : null}
      </div>
    );
  }
);

export const FileItem = FileItemRoot;
