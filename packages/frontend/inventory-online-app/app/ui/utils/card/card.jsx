export default function Card({ children, title, subtitle }) {
    return (
        <div className="bg-neutral-100 block p-6 border border-gray-300 rounded-lg shadow-sm mb-2 w-full h-full">
            {
                title && 
                <h5 className="text-2xl font-semibold tracking-tight text-gray-900 leading-8">
                    {title}
                </h5>
            }
            {
                subtitle && 
                <p className="text-gray-700 mb-6">
                    {subtitle}
                </p>
            }
            <div className="mt-2">
                {children}
            </div>
        </div>
    )
}