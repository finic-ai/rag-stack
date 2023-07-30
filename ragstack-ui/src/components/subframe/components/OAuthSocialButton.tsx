"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface OAuthSocialButtonRootProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "Default" | "Branded";
  children?: string;
  logo?: string;
  className?: string;
}

const OAuthSocialButtonRoot = React.forwardRef<
  HTMLElement,
  OAuthSocialButtonRootProps
>(function OAuthSocialButtonRoot(
  {
    variant = "Default",
    children = "Sign in with Google",
    logo = "https://res.cloudinary.com/demo/image/upload/v1676066751/google-sign-in-button-logo_geeodk.svg",
    className,
    type = "button",
    ...otherProps
  }: OAuthSocialButtonRootProps,
  ref
) {
  return (
    <button
      className={SubframeCore.twClassNames(
        "flex bg-default-background border border-solid border-neutral-border rounded pr-4 pl-4 gap-2 items-center h-10 cursor-pointer group/f1948f75 hover:bg-neutral-50 active:bg-neutral-50",
        {
          "bg-brand-600 hover:bg-brand-700 active:bg-brand-700":
            variant === "Branded",
        },
        className
      )}
      ref={ref as any}
      type={type}
      {...otherProps}
    >
      <img className="flex-none w-5 h-5" src={logo} />
      {children ? (
        <span
          className={SubframeCore.twClassNames(
            "text-body-bold font-body-bold text-default-font",
            { "text-white": variant === "Branded" }
          )}
        >
          {children}
        </span>
      ) : null}
    </button>
  );
});

export const OAuthSocialButton = OAuthSocialButtonRoot;
