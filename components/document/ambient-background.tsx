export default function AmbientBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-1/4 w-125 h-125 bg-orange-100 rounded-full blur-3xl opacity-20" />
            <div className="absolute bottom-0 right-1/4 w-100 h-100 bg-blue-100 rounded-full blur-3xl opacity-20" />
        </div>
    );
}