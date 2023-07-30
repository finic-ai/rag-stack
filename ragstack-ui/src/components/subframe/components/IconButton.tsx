"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface IconButtonRootProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "Default" | "Branded" | "Contained" | "Brand Contained";
  size?: "Default" | "Small" | "XSmall";
  rounded?: boolean;
  loading?: boolean;
  icon?: SubframeCore.IconName;
  className?: string;
}

const IconButtonRoot = React.forwardRef<HTMLElement, IconButtonRootProps>(
  function IconButtonRoot(
    {
      variant = "Default",
      size = "Default",
      rounded = false,
      loading = false,
      icon = "FeatherPlus",
      className,
      type = "button",
      ...otherProps
    }: IconButtonRootProps,
    ref
  ) {
    return (
      <button
        className={SubframeCore.twClassNames(
          "flex rounded gap-2 items-center justify-center w-10 h-10 cursor-pointer group/af9405b1 hover:bg-neutral-100 active:bg-neutral-100 disabled:bg-neutral-200 disabled:cursor-default",
          {
            "rounded-full": rounded,
            "flex-none w-6 h-6": size === "XSmall",
            "flex-none w-8 h-8": size === "Small",
            "bg-brand-50 hover:bg-brand-100 active:bg-brand-100":
              variant === "Brand Contained",
            "bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-200":
              variant === "Contained",
            "hover:bg-brand-100 active:bg-brand-100": variant === "Branded",
          },
          className
        )}
        ref={ref as any}
        type={type}
        {...otherProps}
      >
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-neutral-700 text-[20px] font-[400] leading-[20px] group-hover/af9405b1:text-neutral-700 group-disabled/af9405b1:text-neutral-400",
            {
              hidden: loading,
              "text-[13px] font-[400] leading-[20px]": size === "XSmall",
              "text-[16px] font-[400] leading-[20px]": size === "Small",
              "text-brand-700":
                variant === "Brand Contained" || variant === "Branded",
            }
          )}
          name={icon}
        />
        <SubframeCore.Loader
          className={SubframeCore.twClassNames(
            "hidden text-neutral-500 text-[20px] font-[400] leading-[20px] group-disabled/af9405b1:text-neutral-400",
            {
              "inline-block": loading,
              "text-[16px] font-[400] leading-[20px]":
                size === "XSmall" || size === "Small",
              "text-brand-600":
                variant === "Brand Contained" || variant === "Branded",
            }
          )}
        />
      </button>
    );
  }
);

export const IconButton = IconButtonRoot;
