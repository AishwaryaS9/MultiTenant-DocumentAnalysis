import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
    return (
        <div className='min-h-screen flex items-center justify-center'>
            <SignIn />
        </div>
    )
}


// import { SignIn } from "@clerk/nextjs";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// export default async function SignInPage() {
//     const { userId } = await auth();

//     if (userId) {
//         redirect("/");
//     }

//     return (
//         <div className="min-h-screen flex items-center justify-center">
//             <SignIn />
//         </div>
//     );
// }