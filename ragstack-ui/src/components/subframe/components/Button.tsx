"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface ButtonRootProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "Brand Primary"
    | "Brand Secondary"
    | "Brand Tertiary"
    | "Neutral Secondary"
    | "Neutral Tertiary"
    | "Destructive Primary"
    | "Destructive Secondary"
    | "Destructive Tertiary";
  size?: "Default" | "Small" | "XSmall";
  icon?: SubframeCore.IconName;
  children?: string;
  loading?: boolean;
  rightIcon?: SubframeCore.IconName;
  className?: string;
}

const ButtonRoot = React.forwardRef<HTMLElement, ButtonRootProps>(
  function ButtonRoot(
    {
      variant = "Brand Primary",
      size = "Default",
      icon = null,
      children = "Button",
      loading = false,
      rightIcon = null,
      className,
      type = "button",
      ...otherProps
    }: ButtonRootProps,
    ref
  ) {
    return (
      <button
        className={SubframeCore.twClassNames(
          "flex bg-brand-600 rounded pr-4 pl-4 gap-2 items-center justify-center h-10 cursor-pointer group/3b777358 hover:bg-brand-700 active:bg-brand-700 disabled:bg-neutral-200 disabled:cursor-default hover:disabled:bg-neutral-200 hover:disabled:cursor-default active:disabled:bg-neutral-200 active:disabled:cursor-default",
          {
            "flex-none w-auto h-6 pt-0 pr-2 pb-0 pl-2 flex-row gap-1":
              size === "XSmall",
            "pt-0 pr-3 pb-0 pl-3 flex-none w-auto h-8 flex-row gap-1":
              size === "Small",
            "bg-transparent hover:bg-error-50 active:bg-error-100":
              variant === "Destructive Tertiary",
            "bg-error-50 hover:bg-error-100 active:bg-error-200":
              variant === "Destructive Secondary",
            "bg-error-600 hover:bg-error-700 active:bg-error-700":
              variant === "Destructive Primary",
            "bg-transparent hover:bg-neutral-50 active:bg-neutral-100":
              variant === "Neutral Tertiary",
            "bg-default-background border border-solid border-neutral-border hover:bg-neutral-50 active:bg-neutral-100":
              variant === "Neutral Secondary",
            "bg-transparent hover:bg-brand-100 active:bg-brand-200":
              variant === "Brand Tertiary",
            "bg-brand-50 hover:bg-brand-100 active:bg-brand-200":
              variant === "Brand Secondary",
          },
          className
        )}
        ref={ref as any}
        type={type}
        {...otherProps}
      >
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-white text-[16px] font-[400] leading-[20px] group-disabled/3b777358:text-neutral-400 group-hover/3b777358:group-disabled/3b777358:text-neutral-400 group-active/3b777358:group-disabled/3b777358:text-neutral-400",
            {
              hidden: loading,
              "text-label font-label": size === "XSmall" || size === "Small",
              "text-error-700":
                variant === "Destructive Tertiary" ||
                variant === "Destructive Secondary",
              "text-neutral-700":
                variant === "Neutral Tertiary" ||
                variant === "Neutral Secondary",
              "text-brand-700":
                variant === "Brand Tertiary" || variant === "Brand Secondary",
            }
          )}
          name={icon}
        />
        <div
          className={SubframeCore.twClassNames(
            "hidden gap-2 items-center justify-center flex-none w-4 h-4",
            {
              flex: loading,
              "flex-none w-3 h-3": size === "XSmall" || size === "Small",
            }
          )}
        >
          <SubframeCore.Loader
            className={SubframeCore.twClassNames(
              "text-white text-body font-body group-disabled/3b777358:text-neutral-400",
              {
                "inline-block": loading,
                "text-label font-label": size === "XSmall" || size === "Small",
                "text-error-800":
                  variant === "Destructive Tertiary" ||
                  variant === "Destructive Secondary",
                "text-neutral-700":
                  variant === "Neutral Tertiary" ||
                  variant === "Neutral Secondary",
                "text-brand-700":
                  variant === "Brand Tertiary" || variant === "Brand Secondary",
              }
            )}
          />
        </div>
        {children ? (
          <span
            className={SubframeCore.twClassNames(
              "text-body-bold font-body-bold text-white group-disabled/3b777358:text-neutral-400",
              {
                "text-label-bold font-label-bold":
                  size === "XSmall" || size === "Small",
                "text-error-700": variant === "Destructive Tertiary",
                "text-error-800": variant === "Destructive Secondary",
                "text-neutral-700":
                  variant === "Neutral Tertiary" ||
                  variant === "Neutral Secondary",
                "text-brand-700":
                  variant === "Brand Tertiary" || variant === "Brand Secondary",
              }
            )}
          >
            {children}
          </span>
        ) : null}
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-white text-body font-body group-disabled/3b777358:text-neutral-400",
            {
              "text-label-bold font-label-bold":
                size === "XSmall" || size === "Small",
              "text-error-700": variant === "Destructive Tertiary",
              "text-error-800": variant === "Destructive Secondary",
              "text-neutral-700":
                variant === "Neutral Tertiary" ||
                variant === "Neutral Secondary",
              "text-brand-700":
                variant === "Brand Tertiary" || variant === "Brand Secondary",
            }
          )}
          name={rightIcon}
        />
      </button>
    );
  }
);

export const Button = ButtonRoot;
