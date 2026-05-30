import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <main role="main" aria-label="Sign in page" className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div role="region" aria-label="Authentication form" className="w-full max-w-md flex items-center justify-center">
                <SignIn />
            </div>
        </main>
    );
}