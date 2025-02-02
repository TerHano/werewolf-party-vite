import type { SkeletonProps as ChakraSkeletonProps } from "@chakra-ui/react";
import { Skeleton as ChakraSkeleton } from "@chakra-ui/react";

export const Skeleton = (props: ChakraSkeletonProps) => {
  const { loading } = props;
  if (loading) {
    return <ChakraSkeleton {...props} loading />;
  } else {
    return props.children;
  }
};
