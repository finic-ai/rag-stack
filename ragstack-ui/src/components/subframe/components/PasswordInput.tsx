"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  error?: boolean;
  className?: string;
}

const Input = React.forwardRef<HTMLElement, InputProps>(function Input(
  { placeholder = "", error = false, className, ...otherProps }: InputProps,
  ref
) {
  return (
    <input
      className={SubframeCore.twClassNames(
        "bg-default-background border border-solid border-neutral-border rounded pr-2 pl-2 h-8 text-body font-body text-default-font group/ac110639 focus-within:border focus-within:border-solid focus-within:border-brand-500",
        {
          "border border-solid border-error-400 focus-within:border focus-within:border-solid focus-within:border-error-500":
            error,
        },
        className
      )}
      placeholder={placeholder}
      type="password"
      ref={ref as any}
      {...otherProps}
    />
  );
});

interface PasswordInputRootProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  label?: string;
  children?: React.ReactNode;
  errorText?: string;
  className?: string;
}

const PasswordInputRoot = React.forwardRef<HTMLElement, PasswordInputRootProps>(
  function PasswordInputRoot(
    {
      label = "Label",
      children,
      errorText = "",
      className,
      ...otherProps
    }: PasswordInputRootProps,
    ref
  ) {
    return (
      <label
        className={SubframeCore.twClassNames(
          "flex flex-col gap-1 items-start group/b3bf0b96",
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
        <div className="flex flex-col gap-2 items-start w-full">
          {children !== undefined ? (
            children
          ) : (
            <Input className="flex-none h-8 w-full" />
          )}
        </div>
        {errorText ? (
          <span className="text-body font-body text-error-800">
            {errorText}
          </span>
        ) : null}
      </label>
    );
  }
);

export const PasswordInput = Object.assign(PasswordInputRoot, {
  Input,
});
