import { Text } from "@radix-ui/themes";
import React, {PropsWithChildren} from "react";

const ErrorMessage = ({children}: PropsWithChildren) => {
  if (!children) return null;
  return (
    <div className="mb-5">
      <Text color="red" as="p" size="1">{children}</Text>
    </div>
  );
};

export default ErrorMessage;