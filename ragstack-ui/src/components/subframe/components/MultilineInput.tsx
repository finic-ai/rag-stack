"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
  error?: boolean;
  className?: string;
}

const Input = React.forwardRef<HTMLElement, InputProps>(function Input(
  { placeholder = "", error = false, className, ...otherProps }: InputProps,
  ref
) {
  return (
    <textarea
      className={SubframeCore.twClassNames(
        "bg-default-background border border-solid border-neutral-border rounded pt-2.5 pr-3 pb-2.5 pl-3 text-body font-body text-default-font group/c981d7da focus-within:border focus-within:border-solid focus-within:border-brand-500",
        {
          "border border-solid border-error-400 focus-within:border focus-within:border-solid focus-within:border-error-500":
            error,
        },
        className
      )}
      placeholder={placeholder}
      ref={ref as any}
      {...otherProps}
    />
  );
});

interface MultilineInputRootProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  label?: string;
  children?: React.ReactNode;
  errorText?: string;
  className?: string;
}

const MultilineInputRoot = React.forwardRef<
  HTMLElement,
  MultilineInputRootProps
>(function MultilineInputRoot(
  {
    label = "Label",
    children,
    errorText = "",
    className,
    ...otherProps
  }: MultilineInputRootProps,
  ref
) {
  return (
    <label
      className={SubframeCore.twClassNames(
        "flex flex-col gap-1 items-start group/4ec05ee8",
        className
      )}
      ref={ref as any}
      {...otherProps}
    >
      {label ? (
        <span className="text-body-bold font-body-bold text-subtext-color">
          {label}
        </span>
      ) : null}
      <div className="flex flex-col gap-1 items-start w-full">
        {children !== undefined ? (
          children
        ) : (
          <Input className="flex-none h-auto w-full" error={false} />
        )}
      </div>
      {errorText ? (
        <span className="text-body font-body text-error-800">{errorText}</span>
      ) : null}
    </label>
  );
});

export const MultilineInput = Object.assign(MultilineInputRoot, {
  Input,
});
