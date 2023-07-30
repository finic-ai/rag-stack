"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface AlertRootProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "Neutral" | "Success" | "Error" | "Warning";
  icon?: SubframeCore.IconName;
  title?: string;
  description?: string;
  className?: string;
}

const AlertRoot = React.forwardRef<HTMLElement, AlertRootProps>(
  function AlertRoot(
    {
      variant = "Neutral",
      icon = "FeatherInfo",
      title = "We just released something new!",
      description = "Check out all the latest changes in your profile.",
      className,
      ...otherProps
    }: AlertRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex bg-default-background border border-solid border-neutral-300 rounded pt-4 pr-4 pb-4 pl-4 flex-col gap-2 items-start w-full group/3a65613d",
          {
            "bg-warning-50 border border-solid border-warning-300":
              variant === "Warning",
            "bg-error-50 border border-solid border-error-300":
              variant === "Error",
            "bg-success-50 border border-solid border-success-400":
              variant === "Success",
          },
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div className="flex gap-2 items-start">
          <SubframeCore.Icon
            className={SubframeCore.twClassNames(
              "text-neutral-800 text-[20px] font-[500] leading-[28px]",
              {
                "text-warning-900": variant === "Warning",
                "text-error-900": variant === "Error",
                "text-success-900": variant === "Success",
              }
            )}
            name={icon}
          />
          <div className="flex flex-col gap-0.5 items-start">
            {title ? (
              <span
                className={SubframeCore.twClassNames(
                  "text-body-bold font-body-bold text-neutral-800",
                  {
                    "text-warning-900": variant === "Warning",
                    "text-error-900": variant === "Error",
                    "text-success-900": variant === "Success",
                  }
                )}
              >
                {title}
              </span>
            ) : null}
            {description ? (
              <span
                className={SubframeCore.twClassNames(
                  "text-body font-body text-neutral-700",
                  {
                    "text-warning-900": variant === "Warning",
                    "text-error-900": variant === "Error",
                    "text-success-900 text-body font-body":
                      variant === "Success",
                  }
                )}
              >
                {description}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

export const Alert = AlertRoot;
