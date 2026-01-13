const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
            <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-8 max-w-md text-center">
                <svg
                    className="w-16 h-16 text-red-500 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <h2 className="text-white text-2xl font-bold mb-2">Oops!</h2>
                <p className="text-red-200 mb-4">{message || "Something went wrong. Please try again."}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorMessage;
