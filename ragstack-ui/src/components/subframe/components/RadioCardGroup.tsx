"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";
import { IconWithBackground } from "./IconWithBackground";

interface RadioCardProps
  extends React.ComponentProps<typeof SubframeCore.RadioGroup.Item> {
  children?: React.ReactNode;
  className?: string;
}

const RadioCard = React.forwardRef<HTMLElement, RadioCardProps>(
  function RadioCard(
    { children, className, ...otherProps }: RadioCardProps,
    ref
  ) {
    return (
      <SubframeCore.RadioGroup.Item asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "flex bg-default-background border border-solid border-neutral-200 rounded pt-3 pr-3 pb-3 pl-3 flex-col gap-2 items-start cursor-pointer group/502d4919 hover:border hover:border-solid hover:border-neutral-300 aria-[checked=true]:border aria-[checked=true]:border-solid aria-[checked=true]:border-brand-primary",
            className
          )}
          ref={ref as any}
        >
          <div className="flex gap-2 items-start w-full">
            <div className="flex flex-col gap-2 items-start grow shrink-0 basis-0 w-full">
              {children !== undefined ? (
                children
              ) : (
                <div className="flex pr-2 gap-2 items-start">
                  <IconWithBackground size="Large" icon="FeatherLayers" />
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-body-bold font-body-bold text-default-font">
                      Basic plan
                    </span>
                    <div className="flex gap-1 items-end">
                      <span className="text-[22px] font-[500] leading-[22px] text-default-font">
                        $29
                      </span>
                      <span className="text-label font-label text-neutral-700">
                        per month
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex pt-0.5 gap-2 items-start">
              <div className="flex border border-solid border-neutral-border rounded-full flex-none w-4 h-4 flex-col gap-2 items-center justify-center group-aria-[checked=true]/502d4919:bg-brand-primary group-aria-[checked=true]/502d4919:border group-aria-[checked=true]/502d4919:border-solid group-aria-[checked=true]/502d4919:border-brand-primary">
                <SubframeCore.Icon
                  className="hidden text-white text-label-bold font-label-bold group-aria-[checked=true]/502d4919:inline-flex"
                  name="FeatherCheck"
                />
              </div>
            </div>
          </div>
        </div>
      </SubframeCore.RadioGroup.Item>
    );
  }
);

interface RadioCardGroupRootProps
  extends React.ComponentProps<typeof SubframeCore.RadioGroup.Root> {
  children?: React.ReactNode;
  className?: string;
}

const RadioCardGroupRoot = React.forwardRef<
  HTMLElement,
  RadioCardGroupRootProps
>(function RadioCardGroupRoot(
  { children, className, ...otherProps }: RadioCardGroupRootProps,
  ref
) {
  return (
    <SubframeCore.RadioGroup.Root asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex w-full gap-2 items-start group/6d5193b8",
          className
        )}
        ref={ref as any}
      >
        {children !== undefined ? (
          children
        ) : (
          <>
            <RadioCard value="cf351eed">
              <div className="flex pr-2 gap-2 items-start">
                <IconWithBackground size="Large" icon="FeatherLayers" />
                <div className="flex flex-col gap-1 items-start">
                  <span className="text-body-bold font-body-bold text-default-font">
                    Free plan
                  </span>
                  <div className="flex gap-1 items-end">
                    <span className="text-[22px] font-[500] leading-[22px] text-default-font">
                      $0
                    </span>
                    <span className="text-label font-label text-neutral-700">
                      per month
                    </span>
                  </div>
                </div>
              </div>
            </RadioCard>
            <RadioCard checked={true} value="e8e855c8">
              <div className="flex pr-2 gap-2 items-start">
                <IconWithBackground size="Large" icon="FeatherLayers" />
                <div className="flex flex-col gap-1 items-start">
                  <span className="text-body-bold font-body-bold text-default-font">
                    Basic plan
                  </span>
                  <div className="flex gap-1 items-end">
                    <span className="text-[22px] font-[500] leading-[22px] text-default-font">
                      $29
                    </span>
                    <span className="text-label font-label text-neutral-700">
                      per month
                    </span>
                  </div>
                </div>
              </div>
            </RadioCard>
            <RadioCard value="f5e86c5e">
              <div className="flex pr-2 gap-2 items-start">
                <IconWithBackground size="Large" icon="FeatherLayers" />
                <div className="flex flex-col gap-1 items-start">
                  <span className="text-body-bold font-body-bold text-default-font">
                    Pro plan
                  </span>
                  <div className="flex gap-1 items-end">
                    <span className="text-[22px] font-[500] leading-[22px] text-default-font">
                      $99
                    </span>
                    <span className="text-label font-label text-neutral-700">
                      per month
                    </span>
                  </div>
                </div>
              </div>
            </RadioCard>
          </>
        )}
      </div>
    </SubframeCore.RadioGroup.Root>
  );
});

export const RadioCardGroup = Object.assign(RadioCardGroupRoot, {
  RadioCard,
});
