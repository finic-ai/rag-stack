"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";
import { TextInput } from "./TextInput";
import { MultilineInput } from "./MultilineInput";
import { Button } from "./Button";

interface FullscreenDialogRootProps
  extends React.ComponentProps<typeof SubframeCore.FullScreenDialog.Root> {
  children?: React.ReactNode;
  className?: string;
}

const FullscreenDialogRoot = React.forwardRef<
  HTMLElement,
  FullscreenDialogRootProps
>(function FullscreenDialogRoot(
  { children, className, ...otherProps }: FullscreenDialogRootProps,
  ref
) {
  return (
    <SubframeCore.FullScreenDialog.Root asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex w-full h-full flex-col items-start group/3f094173",
          className
        )}
        ref={ref as any}
      >
        {children !== undefined ? (
          children
        ) : (
          <div className="flex bg-default-background pt-8 pr-8 pb-8 pl-8 flex-col gap-2 items-start grow shrink-0 basis-0 h-full w-full container max-w-none">
            <div className="flex flex-col gap-2 items-end w-full">
              <SubframeCore.Icon
                className="text-default-font text-section-header font-section-header"
                name="FeatherX"
              />
            </div>
            <div className="flex flex-col gap-2 items-center justify-center grow shrink-0 basis-0 h-full w-full">
              <div className="flex flex-col gap-8 items-start w-96">
                <div className="flex flex-col gap-2 items-start">
                  <span className="text-section-header font-section-header text-default-font">
                    Add funds
                  </span>
                  <span className="text-body font-body text-default-font">
                    Your funds will be available within 3 business days
                  </span>
                </div>
                <div className="flex flex-col gap-4 items-start w-full">
                  <TextInput
                    className="flex-none h-auto w-full"
                    label="Amount"
                  />
                  <MultilineInput
                    className="flex-none h-auto w-full"
                    label="Description"
                  />
                </div>
                <Button>Add funds</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SubframeCore.FullScreenDialog.Root>
  );
});

export const FullscreenDialog = FullscreenDialogRoot;
