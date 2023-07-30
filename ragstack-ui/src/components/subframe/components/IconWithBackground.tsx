"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface IconWithBackgroundRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "Default" | "Neutral" | "Error" | "Warning" | "Success";
  size?: "Default" | "Large" | "XLarge" | "XXLarge";
  icon?: SubframeCore.IconName;
  className?: string;
}

const IconWithBackgroundRoot = React.forwardRef<
  HTMLElement,
  IconWithBackgroundRootProps
>(function IconWithBackgroundRoot(
  {
    variant = "Default",
    size = "Default",
    icon = "FeatherCheck",
    className,
    ...otherProps
  }: IconWithBackgroundRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex bg-brand-100 rounded-full gap-2 items-center justify-center w-5 h-5 group/c5d68c0e",
        {
          "flex-none w-12 h-12": size === "XXLarge",
          "flex-none w-9 h-9": size === "XLarge",
          "flex-none w-7 h-7": size === "Large",
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
      <SubframeCore.Icon
        className={SubframeCore.twClassNames(
          "text-brand-800 text-label font-label",
          {
            "text-[24px] font-[500] leading-[38px]": size === "XXLarge",
            "text-subheader font-subheader": size === "XLarge",
            "text-body-bold font-body-bold": size === "Large",
            "text-success-800": variant === "Success",
            "text-warning-800": variant === "Warning",
            "text-error-800": variant === "Error",
            "text-neutral-800": variant === "Neutral",
          }
        )}
        name={icon}
      />
    </div>
  );
});

export const IconWithBackground = IconWithBackgroundRoot;
