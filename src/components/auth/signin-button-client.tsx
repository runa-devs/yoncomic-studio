"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Omit } from "@prisma/client/runtime/library";
import { signIn } from "next-auth/react";

type ClientSignInButtonProps = Omit<ButtonProps, "onClick"> & {
  redirect?: string;
};

export const ClientSignInButton = (props: ClientSignInButtonProps) => {
  return <Button {...props} onClick={() => signIn("google", { callbackUrl: props.redirect })} />;
};
