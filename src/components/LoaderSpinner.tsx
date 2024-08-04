import { Loader } from "lucide-react";

export default function LoaderSpinner() {
  return (
    <div className="h-screen w-full flex-center">
      <Loader className="animate-spin text-orange-1" size={30} />
    </div>
  );
}
