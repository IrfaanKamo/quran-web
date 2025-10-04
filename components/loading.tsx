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
        <EmptyTitle>Fetching {title}...</EmptyTitle>
        <EmptyDescription>
          Do not refresh the page.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
