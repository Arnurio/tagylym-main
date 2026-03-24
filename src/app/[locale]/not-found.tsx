import { Link } from "@/i18n/routing";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-[120px] md:text-[150px] font-black text-[#8B5CF6] leading-none mb-4">
                404
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Бет табылмады
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-md">
                Кешіріңіз, сіз іздеген бет жойылған немесе оның мекенжайы өзгертілген болуы мүмкін.
            </p>
            <Link
                href="/"
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold flex items-center gap-2 px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
                ← Басты бетке
            </Link>
        </div>
    );
}
