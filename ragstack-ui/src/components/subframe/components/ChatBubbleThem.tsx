"use client";
// @subframe/sync-disable
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React, { useEffect, useState } from "react";
import { Avatar } from "./Avatar";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { Text } from "@subframe/core";

interface ChatBubbleThemRootProps extends React.HTMLAttributes<HTMLDivElement> {
  time?: string;
  avatar?: React.ReactNode;
  name?: string;
  message?: string;
  sources?: Array<any>;
  didSelectSource: Function;
  className?: string;
  loading: boolean;
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
    sources = [],
    className,
    didSelectSource,
    loading = false,
    ...otherProps
  }: ChatBubbleThemRootProps,
  ref
) {
  console.log(sources);
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prevCount) => (prevCount % 3) + 1);
    }, 500);

    return () => clearInterval(interval);
  }, []);
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
          {loading ? (
            <div className="flex flex-col gap-2 items-start">
              {".".repeat(dotCount)}
            </div>
          ) : message ? (
            // <ReactMarkdown
            //   rehypePlugins={[rehypeRaw]}
            //   remarkPlugins={[remarkBreaks]}
            //   className="text-body font-body text-default-font text-left"
            // >
            //   {md}
            // </ReactMarkdown>
            <span className="text-body font-body text-default-font text-left whitespace-pre-wrap">
              {message}{" "}
              <div className="py-2">
                <hr className="border-neutral-200 pt-1" />
                {sources.map((source, index) => {
                  return (
                    <div key={index}>
                      {index + 1}.{" "}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          didSelectSource(source);
                        }}
                      >
                        {source}
                      </a>
                    </div>
                  );
                })}
              </div>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export const ChatBubbleThem = ChatBubbleThemRoot;
