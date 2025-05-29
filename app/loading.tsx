import { Loader2, Plane } from "lucide-react";
export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-lg">
      <div className="text-white flex flex-col items-center gap-4">
        <span className="text-lg text-white flex gap-1 items-center font-light animate-pulse">Loading... <Plane/></span>
      </div>
    </div>
  );
}
