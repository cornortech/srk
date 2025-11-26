import { useBankSSO } from '@srk/shared/hooks';

/**
 * Button component to redirect to Bank Program using SSO
 * Use this in the University app dashboard/sidebar
 */
export const BankProgramButton = () => {
    const { redirectToBankProgram, isLoading, error } = useBankSSO();

    return (
        <div className="w-full">
            <button
                onClick={redirectToBankProgram}
                disabled={isLoading}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#b68938] hover:bg-[#e1ba73] text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Connecting...</span>
                    </>
                ) : (
                    <>
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                        </svg>
                        <span>Go to Bank Program</span>
                    </>
                )}
            </button>

            {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};
