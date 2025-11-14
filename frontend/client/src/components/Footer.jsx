import {Link} from "react-router-dom";

export default function Footer() {
    return (

        
        <footer className="bg-bloack text-accent py-8 text-center border-t border-gray-700">
            <div className="flex flex-col items-center gap-3">
                <div className="text-3xl">🍽️</div>
                <div className="flex gap-8 text-sm">
                    <Link to="/">Home</Link>
                    <Link to="/browsemeals">Browse Meals</Link>
                    <Link to="/donate">Donate</Link>
                    <Link to="/myprofile">Account</Link>
                </div>
                <p className="text-xs mt-2">Late-Night Nosh - Lee Vartha 2025</p>
            </div>
        </footer>

        
    );
}