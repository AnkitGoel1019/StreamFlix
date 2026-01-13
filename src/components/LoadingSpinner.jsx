const LoadingSpinner = ({ size = "large", message = "Loading..." }) => {
    const sizeClasses = {
        small: "h-8 w-8 border-2",
        medium: "h-12 w-12 border-3",
        large: "h-16 w-16 border-4"
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div
                className={`${sizeClasses[size]} animate-spin rounded-full border-t-purple-500 border-b-pink-500 border-l-transparent border-r-transparent`}
            ></div>
            {message && <p className="mt-4 text-slate-400 text-lg">{message}</p>}
        </div>
    );
};

export default LoadingSpinner;
