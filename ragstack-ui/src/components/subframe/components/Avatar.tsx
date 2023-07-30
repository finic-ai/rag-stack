"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface AvatarRootProps extends React.HTMLAttributes<HTMLDivElement> {
  color?:
    | "Default"
    | "Red"
    | "Yellow"
    | "Green"
    | "Neutral"
    | "Default Inverted"
    | "Red Inverted"
    | "Yellow Inverted"
    | "Green Inverted"
    | "Neutral Inverted";
  size?: "Default" | "Small" | "XSmall";
  children?: string;
  className?: string;
}

const AvatarRoot = React.forwardRef<HTMLElement, AvatarRootProps>(
  function AvatarRoot(
    {
      color = "Default",
      size = "Default",
      children = "AB",
      className,
      ...otherProps
    }: AvatarRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex bg-brand-600 rounded-full flex-col gap-2 items-center justify-center w-9 h-9 group/bec25ae6",
          {
            "flex-none w-5 h-5": size === "XSmall",
            "flex-none w-7 h-7": size === "Small",
            "bg-neutral-100": color === "Neutral Inverted",
            "bg-success-100": color === "Green Inverted",
            "bg-warning-100": color === "Yellow Inverted",
            "bg-error-100": color === "Red Inverted",
            "bg-brand-100": color === "Default Inverted",
            "bg-neutral-600": color === "Neutral",
            "bg-success-600": color === "Green",
            "bg-warning-600": color === "Yellow",
            "bg-error-600": color === "Red",
          },
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {children ? (
          <span
            className={SubframeCore.twClassNames(
              "text-body-bold font-body-bold text-white",
              {
                "text-[10px] font-[600] leading-[10px]": size === "XSmall",
                "text-label-bold font-label-bold": size === "Small",
                "text-neutral-800": color === "Neutral Inverted",
                "text-success-800": color === "Green Inverted",
                "text-warning-800": color === "Yellow Inverted",
                "text-error-800": color === "Red Inverted",
                "text-brand-800": color === "Default Inverted",
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

export const Avatar = AvatarRoot;
