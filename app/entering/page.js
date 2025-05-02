"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const WelcomePage = () => {
    const router = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.push("/user-dashboard");
        }, 4800);

        return () => clearTimeout(timeout);
    }, [router]);

    const skip = () => router.push("/user-dashboard");

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black text-white">
            <img
                src="/door.gif"
                alt="Opening Door"
                className="rounded-lg"
            />

            <Button
                onClick={skip}
                className="absolute top-4 right-4 bg-white text-black hover:bg-gray-200 transition"
            >
                Skip
            </Button>
        </div>
    );
};

export default WelcomePage;
