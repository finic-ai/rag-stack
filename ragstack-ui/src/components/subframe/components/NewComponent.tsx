"use client";
// @subframe/sync-disable
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React, { useRef, useEffect } from "react";
import { ChatBubbleYou } from "./ChatBubbleYou";
import { AvatarImage } from "./AvatarImage";
import { ChatBubbleThem } from "./ChatBubbleThem";

interface NewComponentRootProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  messages: Array<any>;
  didSelectSource: Function;
  loading: boolean;
}

const NewComponentRoot = React.forwardRef<HTMLElement, NewComponentRootProps>(
  function NewComponentRoot(
    { className, ...otherProps }: NewComponentRootProps,
    ref
  ) {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [otherProps.messages]);

    return (
      <div
        className={SubframeCore.twClassNames(
          "flex flex-col gap-2 items-start w-full h-full cursor-pointer group/c5157938",
          className
        )}
        ref={ref as any}
        {...otherProps}
      >
        <div className="flex flex-col gap-4 items-start grow shrink-0 basis-0 h-full w-full">
          {otherProps.messages.map((message) => {
            // If message.user is true, then render ChatBubbleYou otherwise render ChatBubbleThem
            if (message.isUser) {
              return (
                <ChatBubbleYou time={""} message={message.message.answer} />
              );
            } else {
              console.log(message.message.sources);
              const dedupeSources = [...new Set(message.message.sources)];
              return (
                <ChatBubbleThem
                  time={""}
                  avatar={
                    <AvatarImage src="https://res.cloudinary.com/demo/image/upload/v1690994866/Icon_6_mo6skf.png" />
                  }
                  name="Bot"
                  loading={false}
                  message={message.message.answer}
                  sources={dedupeSources}
                  didSelectSource={otherProps.didSelectSource}
                />
              );
            }
          })}
          {otherProps.loading ? (
            <ChatBubbleThem
              time={""}
              avatar={
                <AvatarImage src="https://res.cloudinary.com/demo/image/upload/v1690994866/Icon_6_mo6skf.png" />
              }
              name="Bot"
              message="..."
              sources={[]}
              didSelectSource={otherProps.didSelectSource}
              loading={true}
            />
          ) : null}

          <div ref={messagesEndRef} />
        </div>
      </div>
    );
  }
);

export const NewComponent = NewComponentRoot;
