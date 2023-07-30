"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";
import { Button } from "./Button";

interface ContentProps
  extends React.ComponentProps<typeof SubframeCore.Dialog.Content> {
  children?: React.ReactNode;
  className?: string;
}

const Content = React.forwardRef<HTMLElement, ContentProps>(function Content(
  { children, className, ...otherProps }: ContentProps,
  ref
) {
  return (
    <SubframeCore.Dialog.Content asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex bg-default-background rounded shadow flex-col gap-2 items-start group/04ea6d47",
          className
        )}
        ref={ref as any}
      >
        {children !== undefined ? (
          children
        ) : (
          <div className="flex pt-6 pr-6 pb-6 pl-6 flex-col gap-6 items-start w-96">
            <div className="flex flex-col gap-1 items-start">
              <span className="text-subheader font-subheader text-default-font">
                Delete your account?
              </span>
              <span className="text-body font-body text-default-font">
                This action cannot be undone. This will permanently remove all
                data from our servers.
              </span>
            </div>
            <div className="flex grow shrink-0 basis-0 h-full w-full flex-col gap-2 items-end justify-center">
              <div className="flex gap-2 items-start">
                <Button variant="Neutral Tertiary" icon="FeatherX">
                  Cancel
                </Button>
                <Button variant="Destructive Primary" icon="FeatherTrash2">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SubframeCore.Dialog.Content>
  );
});

interface DialogRootProps
  extends React.ComponentProps<typeof SubframeCore.Dialog.Root> {
  children?: React.ReactNode;
  className?: string;
}

const DialogRoot = React.forwardRef<HTMLElement, DialogRootProps>(
  function DialogRoot(
    { children, className, ...otherProps }: DialogRootProps,
    ref
  ) {
    return (
      <SubframeCore.Dialog.Root asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "flex bg-[#00000066] w-full h-full flex-col gap-2 items-center justify-center group/ca59db17",
            className
          )}
          ref={ref as any}
        >
          {children !== undefined ? children : <Content />}
        </div>
      </SubframeCore.Dialog.Root>
    );
  }
);

export const Dialog = Object.assign(DialogRoot, {
  Content,
});
