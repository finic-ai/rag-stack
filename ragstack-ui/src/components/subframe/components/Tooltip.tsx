"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface TooltipRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: string;
  className?: string;
}

const TooltipRoot = React.forwardRef<HTMLElement, TooltipRootProps>(
  function TooltipRoot(
    {
      children = "Tooltip contents",
      className,
      ...otherProps
    }: TooltipRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex bg-default-background border border-solid border-neutral-border rounded shadow pt-1 pr-2 pb-1 pl-2 flex-col gap-2 items-start group/ccebd1e9",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {children ? (
          <span className="text-label font-label text-default-font">
            {children}
          </span>
        ) : null}
      </div>
    );
  }
);

export const Tooltip = TooltipRoot;
