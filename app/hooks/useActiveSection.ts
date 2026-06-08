"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function useActiveSection() {
    const pathname = usePathname();
    const [activeHash, setActiveHash] = useState("");

    useEffect(() => {
        if (pathname !== "/") return;

        const hashes = [
            "#why-choose-us",
            "#features",
            "#how-it-works",
            "#cta",
        ];

        const elements = hashes
            .map((hash) => document.querySelector(hash))
            .filter(Boolean);

        let hasScrolled = false;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!hasScrolled && window.scrollY < 80) {
                    setActiveHash("");
                    return;
                }

                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveHash(`#${entry.target.id}`);
                    }
                });
            },
            {
                root: null,
                rootMargin: "-20% 0px -60% 0px",
                threshold: 0,
            }
        );

        elements.forEach((el) => {
            if (el) observer.observe(el);
        });

        const handleScroll = () => {
            hasScrolled = true;

            if (window.scrollY < 100) {
                setActiveHash("");
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            elements.forEach((el) => {
                if (el) observer.unobserve(el);
            });

            window.removeEventListener("scroll", handleScroll);
        };
    }, [pathname]);

    return { activeHash, pathname };
}