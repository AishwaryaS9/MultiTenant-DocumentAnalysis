'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser, useOrganization } from "@clerk/nextjs";

export default function CTASection() {
  const { user } = useUser();
  const { organization } = useOrganization();

  const href = user
    ? organization
      ? `/${organization.slug}`
      : "/dashboard"
    : "/sign-up";


  return (
    <section id="cta" className="py-24 bg-[#1A1A1A] text-white">
      <div className="container max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6 tracking-tight">
          Ready to analyze your documents?
        </h2>

        <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg">
          Join thousands of teams using Docinate AI to work smarter with their documents.
        </p>

        <Link href={href}>
          <Button
            size="lg"
            className="px-10 py-7 h-auto rounded-full bg-white text-black hover:bg-gray-100 text-lg font-semibold"
          >
            {user ? "Go to Dashboard" : "Get Started Free"}
          </Button>
        </Link>

        {!user && (
          <p className="text-sm text-gray-500 mt-6 font-medium">
            No credit card required • 14-day free trial.
          </p>
        )}
      </div>
    </section>
  );
}

