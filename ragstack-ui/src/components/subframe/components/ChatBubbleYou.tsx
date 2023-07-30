"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface ChatBubbleYouRootProps extends React.HTMLAttributes<HTMLDivElement> {
  time?: string;
  message?: string;
  name?: string;
  className?: string;
}

const ChatBubbleYouRoot = React.forwardRef<HTMLElement, ChatBubbleYouRootProps>(
  function ChatBubbleYouRoot(
    {
      time = "9 min ago",
      message = "I will get to the reports to the client by Monday. If you don't hear from me by then, just reach back out.",
      name = "You",
      className,
      ...otherProps
    }: ChatBubbleYouRootProps,
    ref
  ) {
    return (
      <div
        className={SubframeCore.twClassNames(
          "flex flex-col gap-2 items-end justify-center w-full group/8206bfc1",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div className="flex flex-col gap-1 items-start">
          <div className="flex gap-2 items-start">
            {name ? (
              <span className="text-body-bold font-body-bold text-default-font">
                {name}
              </span>
            ) : null}
            {time ? (
              <span className="text-body font-body text-subtext-color">
                {time}
              </span>
            ) : null}
          </div>
          <div className="flex bg-brand-600 rounded pt-2 pr-3 pb-2 pl-3 flex-col gap-2 items-start w-96">
            {message ? (
              <span className="text-body font-body text-white">{message}</span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

export const ChatBubbleYou = ChatBubbleYouRoot;
