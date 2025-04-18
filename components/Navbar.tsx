import Link from 'next/link';
import React from 'react';
function Navbar() {
    return (
        <nav className="bg-[#121212] text-gray-200 px-6 py-4 flex justify-start gap-20 items-center shadow-lg">
            <div className="text-2xl font-bold text-gray-200">Graph Coloring Simulator</div>
            <ul className="flex space-x-8">
                <li>
                    <Link href="/" className="hover:text-white transition-colors text-muted-foreground">Home</Link>
                </li>
                <li>
                    <Link href="#about" className="hover:text-white transition-colors text-muted-foreground">About</Link>
                </li>
                <li>
                    <Link href="/simulate" className="hover:text-white transition-colors text-muted-foreground">Simulate</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar
