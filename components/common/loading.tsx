import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

interface LoadingProps {
  title: string;
}

export default function Loading({ title }: LoadingProps) {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Loading {title}...</EmptyTitle>
        <EmptyDescription>
          We're getting things ready.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
