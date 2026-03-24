export default function GlobalLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 space-y-4">
            <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full absolute border-4 border-solid border-gray-200"></div>
                <div className="w-16 h-16 rounded-full animate-spin absolute border-4 border-solid border-[#0B5CFF] border-t-transparent"></div>
            </div>
            <p className="text-gray-500 font-medium animate-pulse">Loading...</p>
        </div>
    );
}
