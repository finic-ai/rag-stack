"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface BadgeRootProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "Brand" | "Neutral" | "Error" | "Warning" | "Success";
  children?: string;
  className?: string;
}

const BadgeRoot = React.forwardRef<HTMLElement, BadgeRootProps>(
  function BadgeRoot(
    {
      variant = "Brand",
      children = "Badge",
      className,
      ...otherProps
    }: BadgeRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex bg-brand-100 rounded-full pt-0.5 pr-2.5 pb-0.5 pl-2.5 flex-col gap-2 items-start group/97bdb082",
          {
            "bg-success-100": variant === "Success",
            "bg-warning-100": variant === "Warning",
            "bg-error-100": variant === "Error",
            "bg-neutral-100": variant === "Neutral",
          },
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {children ? (
          <span
            className={SubframeCore.twClassNames(
              "text-label font-label text-brand-800",
              {
                "text-success-800": variant === "Success",
                "text-warning-800": variant === "Warning",
                "text-error-800": variant === "Error",
                "text-neutral-800": variant === "Neutral",
              }
            )}
          >
            {children}
          </span>
        ) : null}
      </div>
    );
  }
);

export const Badge = BadgeRoot;
