import { motion } from "framer-motion";

const DashboardSkeleton = () => {
    return (
        <div className="animate-pulse space-y-12">
            {/* Goal Skeleton */}
            <div className="h-48 bg-base-200 rounded-[2.5rem]"></div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-base-200 rounded-[2rem]"></div>
                ))}
            </div>

            {/* Recommendations Skeleton */}
            <section>
                <div className="h-8 w-48 bg-base-200 rounded mb-8"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="space-y-3">
                            <div className="aspect-[3/4] bg-base-200 rounded-2xl"></div>
                            <div className="h-4 w-full bg-base-200 rounded"></div>
                            <div className="h-3 w-1/2 bg-base-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="h-10 w-64 bg-base-200 rounded-xl"></div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-base-200 rounded-[2rem]"></div>
                    ))}
                </div>
                <div className="space-y-8">
                    <div className="h-64 bg-base-200 rounded-[2rem]"></div>
                    <div className="h-80 bg-base-300/30 rounded-[2rem]"></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
