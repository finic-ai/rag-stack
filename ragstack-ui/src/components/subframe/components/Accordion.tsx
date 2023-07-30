"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface TriggerProps
  extends React.ComponentProps<typeof SubframeCore.Collapsible.Trigger> {
  children?: React.ReactNode;
  className?: string;
}

const Trigger = React.forwardRef<HTMLElement, TriggerProps>(function Trigger(
  { children, className, ...otherProps }: TriggerProps,
  ref
) {
  return (
    <SubframeCore.Collapsible.Trigger asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex flex-col gap-2 items-start w-full cursor-pointer group/476799c5",
          className
        )}
        ref={ref as any}
      >
        {children !== undefined ? (
          children
        ) : (
          <div className="flex pt-2 pr-3 pb-2 pl-3 gap-2 items-center w-full">
            <span className="grow shrink-0 basis-0 w-full text-body font-body text-default-font">
              Accordion header
            </span>
            <SubframeCore.Icon
              className="text-subtext-color text-body font-body group-hover/476799c5:text-default-font"
              name="FeatherChevronDown"
            />
          </div>
        )}
      </div>
    </SubframeCore.Collapsible.Trigger>
  );
});

interface ContentProps
  extends React.ComponentProps<typeof SubframeCore.Collapsible.Content> {
  children?: React.ReactNode;
  className?: string;
}

const Content = React.forwardRef<HTMLElement, ContentProps>(function Content(
  { children, className, ...otherProps }: ContentProps,
  ref
) {
  return (
    <SubframeCore.Collapsible.Content asChild={true} {...otherProps}>
      <div
        className={SubframeCore.twClassNames(
          "flex flex-col gap-2 items-start w-full h-full group/991223eb",
          className
        )}
        ref={ref as any}
      >
        {children !== undefined ? (
          children
        ) : (
          <div className="flex pt-2 pr-3 pb-2 pl-3 grow shrink-0 basis-0 h-full w-full flex-col gap-2 items-start">
            <span className="text-body font-body text-default-font">
              Accordion contents
            </span>
          </div>
        )}
      </div>
    </SubframeCore.Collapsible.Content>
  );
});

interface AccordionRootProps
  extends React.ComponentProps<typeof SubframeCore.Collapsible.Root> {
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const AccordionRoot = React.forwardRef<HTMLElement, AccordionRootProps>(
  function AccordionRoot(
    { trigger, children, className, ...otherProps }: AccordionRootProps,
    ref
  ) {
    return (
      <SubframeCore.Collapsible.Root asChild={true} {...otherProps}>
        <div
          className={SubframeCore.twClassNames(
            "flex rounded w-full flex-col items-start group/d2e81e20",
            className
          )}
          ref={ref as any}
        >
          <div className="flex grow shrink-0 basis-0 h-full w-full flex-col gap-2 items-start group-data-[state=open]/d2e81e20:flex-none group-data-[state=open]/d2e81e20:h-auto group-data-[state=open]/d2e81e20:w-full">
            {trigger !== undefined ? trigger : <Trigger />}
          </div>
          <div className="flex grow shrink-0 basis-0 h-full w-full flex-col gap-2 items-start">
            {children !== undefined ? (
              children
            ) : (
              <Content className="flex-none h-auto w-full group-data-[state=open]/d2e81e20:grow group-data-[state=open]/d2e81e20:shrink-0 group-data-[state=open]/d2e81e20:basis-0 group-data-[state=open]/d2e81e20:h-full group-data-[state=open]/d2e81e20:w-full">
                <div className="flex pt-2 pr-3 pb-2 pl-3 grow shrink-0 basis-0 h-full w-full flex-col gap-2 items-start">
                  <span className="text-body font-body text-default-font">
                    Accordion contents
                  </span>
                </div>
              </Content>
            )}
          </div>
        </div>
      </SubframeCore.Collapsible.Root>
    );
  }
);

export const Accordion = Object.assign(AccordionRoot, {
  Trigger,
  Content,
});
