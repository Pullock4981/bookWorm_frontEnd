const AdminSkeleton = () => {
    return (
        <div className="animate-pulse space-y-12 p-6 md:p-12">
            <header className="mb-8">
                <div className="h-8 w-48 bg-base-200 rounded mb-2"></div>
                <div className="h-4 w-64 bg-base-200 rounded"></div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-40 bg-base-200 rounded-[2rem]"></div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-[400px] bg-base-200 rounded-[2rem]"></div>
                <div className="h-[400px] bg-base-200 rounded-[2rem]"></div>
            </div>
        </div>
    );
};

export default AdminSkeleton;
