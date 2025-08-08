import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonCard = () => (
    <div className="w-[250px] h-[130px] rounded-xl border p-4 shadow-sm flex flex-col justify-between">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-8 w-1/3" />
    </div>
);
