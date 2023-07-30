"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";
import { Avatar } from "./Avatar";

interface ChatBubbleThemRootProps extends React.HTMLAttributes<HTMLDivElement> {
  time?: string;
  avatar?: React.ReactNode;
  name?: string;
  message?: string;
  className?: string;
}

const ChatBubbleThemRoot = React.forwardRef<
  HTMLElement,
  ChatBubbleThemRootProps
>(function ChatBubbleThemRoot(
  {
    time = "11:10pm",
    avatar,
    name = "Jane Doe",
    message = "Hey John, client just called asking about our reports. Could we get this done before Monday?",
    className,
    ...otherProps
  }: ChatBubbleThemRootProps,
  ref
) {
  return (
    <div
      className={SubframeCore.twClassNames(
        "flex gap-2 items-start w-full group/5fa1557c",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      <div className="flex gap-2 items-start flex-none w-9 h-9">
        {avatar !== undefined ? avatar : <Avatar />}
      </div>
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
        <div className="flex bg-neutral-100 rounded pt-2 pr-3 pb-2 pl-3 flex-col gap-2 items-start w-96">
          {message ? (
            <span className="text-body font-body text-default-font">
              {message}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export const ChatBubbleThem = ChatBubbleThemRoot;
