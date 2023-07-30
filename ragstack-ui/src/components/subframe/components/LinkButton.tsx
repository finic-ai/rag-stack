"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface LinkButtonRootProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?:
    | "Default"
    | "Label"
    | "Label Bold"
    | "Body Bold"
    | "Subheader"
    | "Section Header"
    | "Header";
  icon?: SubframeCore.IconName;
  children?: string;
  className?: string;
}

const LinkButtonRoot = React.forwardRef<HTMLElement, LinkButtonRootProps>(
  function LinkButtonRoot(
    {
      size = "Default",
      icon = "FeatherPlus",
      children = "Label",
      className,
      type = "button",
      ...otherProps
    }: LinkButtonRootProps,
    ref
  ) {
    return (
      <button
        className={SubframeCore.twClassNames(
          "flex gap-1 items-center cursor-pointer group/a4ee726a",
          {
            "flex-row gap-2":
              size === "Header" ||
              size === "Section Header" ||
              size === "Subheader",
          },
          className
        )}
        ref={ref as any}
        type={type}
        {...otherProps}
      >
        <SubframeCore.Icon
          className={SubframeCore.twClassNames(
            "text-subtext-color text-body font-body group-hover/a4ee726a:text-default-font",
            {
              "text-header font-header": size === "Header",
              "text-section-header font-section-header":
                size === "Section Header",
              "text-subheader font-subheader": size === "Subheader",
              "text-body-bold font-body-bold": size === "Body Bold",
              "text-label-bold font-label-bold": size === "Label Bold",
              "text-label font-label": size === "Label",
            }
          )}
          name={icon}
        />
        {children ? (
          <span
            className={SubframeCore.twClassNames(
              "text-body font-body text-subtext-color group-hover/a4ee726a:text-default-font",
              {
                "text-header font-header": size === "Header",
                "text-section-header font-section-header":
                  size === "Section Header",
                "text-subheader font-subheader": size === "Subheader",
                "text-body-bold font-body-bold": size === "Body Bold",
                "text-label-bold font-label-bold": size === "Label Bold",
                "text-label font-label": size === "Label",
              }
            )}
          >
            {children}
          </span>
        ) : null}
      </button>
    );
  }
);

export const LinkButton = LinkButtonRoot;
