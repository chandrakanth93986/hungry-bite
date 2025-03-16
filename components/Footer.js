"use client";

const Footer = () => {
    return (
        <footer className="bg-primary text-white">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm sm:text-center">
                    @Hungry-Bite. All Rights Reserved.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium sm:mt-0">
                    <li>
                        <a href="#" className="hover:underline me-4 md:me-6">
                            About
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline me-4 md:me-6">
                            Privacy Policy
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline me-4 md:me-6">
                            Licensing
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline">
                            Contact
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;