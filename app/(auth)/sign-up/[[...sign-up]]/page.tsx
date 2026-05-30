import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <main role="main" aria-label="Sign up page" className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div role="region" aria-label="Account creation form" className="w-full max-w-md flex items-center justify-center">
                <SignUp />
            </div>
        </main>
    );
}