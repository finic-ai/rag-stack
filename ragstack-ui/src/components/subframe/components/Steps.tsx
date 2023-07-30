"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";
import { Avatar } from "./Avatar";
import { IconWithBackground } from "./IconWithBackground";

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  firstStep?: boolean;
  lastStep?: boolean;
  variant?: "Default" | "Success" | "Error" | "Active";
  stepNumber?: string;
  className?: string;
}

const Step = React.forwardRef<HTMLElement, StepProps>(function Step(
  {
    name = "Step 1",
    firstStep = false,
    lastStep = false,
    variant = "Default",
    stepNumber = "1",
    className,
    ...otherProps
  }: StepProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex flex-col gap-1 items-center justify-center w-full cursor-pointer group/68359b37",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex gap-2 items-center justify-center w-full">
        <div
          className={SubframeCore.twClassNames(
            "flex bg-neutral-300 grow shrink-0 basis-0 w-full h-px flex-col gap-2 items-center",
            { "bg-transparent": firstStep }
          )}
        />
        <div className="flex items-center justify-center">
          <Avatar
            className={SubframeCore.twClassNames({
              hidden:
                variant === "Active" ||
                variant === "Error" ||
                variant === "Success",
            })}
            color="Neutral Inverted"
            size="Small"
          >
            {stepNumber}
          </Avatar>
          <Avatar
            className={SubframeCore.twClassNames("hidden", {
              flex: variant === "Active",
            })}
            color="Neutral"
            size="Small"
          >
            {stepNumber}
          </Avatar>
          <IconWithBackground
            className={SubframeCore.twClassNames("hidden", {
              flex: variant === "Error",
            })}
            variant="Error"
            size="Large"
            icon="FeatherX"
          />
          <IconWithBackground
            className={SubframeCore.twClassNames("hidden", {
              flex: variant === "Success",
            })}
            variant="Success"
            size="Large"
          />
        </div>
        <div
          className={SubframeCore.twClassNames(
            "flex bg-neutral-300 grow shrink-0 basis-0 w-full h-px flex-col gap-2 items-center",
            { "bg-transparent": lastStep }
          )}
        />
      </div>
      {name ? (
        <span
          className={SubframeCore.twClassNames(
            "text-body font-body text-subtext-color group-hover/68359b37:text-default-font",
            {
              "text-default-font text-body-bold font-body-bold":
                variant === "Active" ||
                variant === "Error" ||
                variant === "Success",
            }
          )}
        >
          {name}
        </span>
      ) : null}
    </div>
  );
});

interface StepsRootProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const StepsRoot = React.forwardRef<HTMLElement, StepsRootProps>(
  function StepsRoot(
    { children, className, ...otherProps }: StepsRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex items-start justify-center w-full group/1d5e50a5",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        {children !== undefined ? (
          children
        ) : (
          <>
            <Step name="Create an account" firstStep={true} variant="Success" />
            <Step name="Enter details" variant="Error" stepNumber="2" />
            <Step name="Invite your team" variant="Active" stepNumber="3" />
            <Step name="Start building!" lastStep={true} stepNumber="4\n" />
          </>
        )}
      </div>
    );
  }
);

export const Steps = Object.assign(StepsRoot, {
  Step,
});
