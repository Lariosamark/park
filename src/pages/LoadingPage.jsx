import { LoaderIcon } from "lucide-react";

export default function LoadingPage() {
  return (
    <main className="h-screen w-full flex">
      <LoaderIcon className="animate-spin m-auto" />
    </main>
  );
}
