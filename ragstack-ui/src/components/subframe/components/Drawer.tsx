"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";
import { TextInput } from "./TextInput";
import { Button } from "./Button";

interface ContentProps
  extends React.ComponentProps<typeof SubframeCore.Drawer.Content> {
  children?: React.ReactNode;
  className?: string;
}

const Content = React.forwardRef<HTMLElement, ContentProps>(function Content(
  { children, className, ...otherProps }: ContentProps,
  ref
) {
  return (
    <SubframeCore.Drawer.Content asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex bg-default-background border-l border-solid border-neutral-border w-96 h-full flex-col gap-2 items-start group/29ed60d3",
          className
        )}
        ref={ref as any}
      >
        {children !== undefined ? (
          children
        ) : (
          <>
            <div className="flex pt-8 pr-8 pb-8 pl-8 flex-col gap-8 items-start grow shrink-0 basis-0 h-full w-full">
              <span className="text-subheader font-subheader text-default-font">
                Payment to Uber
              </span>
              <div className="flex flex-col gap-4 items-start">
                <span className="text-body-bold font-body-bold text-default-font">
                  Details
                </span>
                <div className="flex flex-col gap-2 items-start">
                  <div className="flex flex-col gap-0.5 items-start">
                    <span className="text-label font-label text-neutral-500">
                      Name
                    </span>
                    <span className="text-body font-body text-default-font">
                      John Thomas
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 items-start">
                    <span className="text-label font-label text-neutral-500">
                      Merchant address
                    </span>
                    <span className="text-body font-body text-default-font">
                      San Francisco
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 items-start">
                    <span className="text-label font-label text-neutral-500">
                      Category
                    </span>
                    <span className="text-body font-body text-default-font">
                      Rideshare / Taxi
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 items-start">
                <span className="text-body-bold font-body-bold text-default-font">
                  Payment
                </span>
                <div className="flex flex-col gap-2 items-start">
                  <div className="flex flex-col gap-0.5 items-start">
                    <span className="text-label font-label text-neutral-500">
                      Amount
                    </span>
                    <span className="text-body font-body text-default-font">
                      $13.42
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 items-start">
                    <span className="text-label font-label text-neutral-500">
                      Card number
                    </span>
                    <span className="text-body font-body text-default-font">
                      1412
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 items-start">
                    <span className="text-label font-label text-neutral-500">
                      Purchased at
                    </span>
                    <span className="text-body font-body text-default-font">
                      January 3, 2023
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5 items-start">
                    <span className="text-label font-label text-neutral-500">
                      Payment posted at
                    </span>
                    <span className="text-body font-body text-default-font">
                      Jan 4, 2023, 8:33 AM
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 items-start w-full">
                <span className="text-body-bold font-body-bold text-default-font">
                  Memo
                </span>
                <TextInput
                  className="flex-none h-auto w-full"
                  label="Additional details"
                />
              </div>
            </div>
            <div className="flex pt-2 pr-8 pb-8 pl-8 grow shrink-0 basis-0 h-full w-full flex-col gap-2 items-end justify-end">
              <Button icon="FeatherCheck">Save</Button>
            </div>
          </>
        )}
      </div>
    </SubframeCore.Drawer.Content>
  );
});

interface DrawerRootProps
  extends React.ComponentProps<typeof SubframeCore.Drawer.Root> {
  children?: React.ReactNode;
  className?: string;
}

const DrawerRoot = React.forwardRef<HTMLElement, DrawerRootProps>(
  function DrawerRoot(
    { children, className, ...otherProps }: DrawerRootProps,
    ref
  ) {
    return (
      <SubframeCore.Drawer.Root asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "flex bg-[#00000066] w-full h-full flex-col gap-2 items-end justify-center group/1e71b2cb",
            className
          )}
          ref={ref as any}
        >
          {children !== undefined ? children : <Content />}
        </div>
      </SubframeCore.Drawer.Root>
    );
  }
);

export const Drawer = Object.assign(DrawerRoot, {
  Content,
});
