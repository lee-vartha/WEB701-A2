import MealCard from "../components/MealCard";
import missionOneImage from "../assets/mission-1.png";
import missionTwoImage from "../assets/mission-2.png";
import howItWorksImage from "../assets/how-it-works.png";
import wrapImg from "../assets/grilled-wrap.png";
import pizzaImg from "../assets/pizza.png";
import pastaImg from "../assets/spaghetti.png";
import rocketImg from "../assets/rocket.png";

export default function Home() {
    return (
        <div className="bg-dark text-accent font-serif">
            {/* HERO */}
            <section className="min-h-[80vh] flex flex-col justify-center px-24 py-20 border-b border-gray-700">
                <h2 className="text-3xl text-[#b7a979] mb-2">Late-Night Nosh</h2>
                <h1 className="text-6xl text-[#c3d7dc] font-light leading-tight mb-6">
                    Good Food, After a Good Shift.
                </h1>
                <p className="text-lg text-[#b9b9b9] max-w-3xl mb-10">
                    Reserve hot, surplus foods from Nelson cafes and diners at an affordable price - right at the end of your shift.
                </p>
                <div className="flex gap-6">
                    <button className="bg-[#86aab4] text-dark px-6 py-3 border-2 border-[#86aab4] rounded-md hover:bg-transparent hover:text-[#86aab4] transition-all">
                        <a href="/browsemeals">Grab a Meal</a>
                    </button>
                    <button className="border-2 border-[#86aab4] px-6 py-3 rounded-md text-[#86aab4] hover:bg-[#86aab4] hover:text-dark transition-all">
                        <a href="/donate">Become a Donor</a>
                    </button>
                </div>

                <img
                    src={rocketImg}
                    alt=""
                    aria-hidden="true"
                    className="
                    pointer-events-none select-none
                    absolute right-[7vw]    /* horizontal position */
                    top-1/2                /* anchor to mid-height of section */
                    -translate-y-[28%]     /* nudge upward to align with headline */
                    w-[34vw] max-w-[360px] min-w-[260px] h-auto opacity-90
                    hidden md:block
                    "
                />

                {/* extra bottom padding so content doesn't collide with rocket on short screens */}
                <div className="h-40 md:hidden" />
              </section>

            {/* MISSION */}
            <section className="px-16 py-20 text-center border-b border-gray-700">
                <h2 className="text-5xl text-[#b8a979] mb-10">Our Mission</h2>
                <div className="grid md:grid-cols-2 gap-8 text-left">
                    <p className="text-[#b9b9b9] text-[17px] leading-relaxed px-6 text-left">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    <br></br>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    <br></br><br></br>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum                    
                    </p>
                    <img src={missionOneImage} alt="Mission" className="rounded-md px-12 pb-12" />


                    <img src={missionTwoImage} alt="Mission" className="rounded-md px-12" />
                    <p className="text-[#b9b9b9] text-[17px] leading-relaxed px-6 text-right">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                    <br></br>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    <br></br><br></br>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum                    
                    </p>

                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="px-16 py-20 text-center border-b border-gray-700">
                <h2 className="text-5xl text-[#b8a979] mb-12">How it Works</h2>
                <img src={howItWorksImage} alt="How it works flow diagram" className="mx-auto max-w-7xl w-full"></img>
            </section>

            {/* BROWSE MEALS */}
            <section className="px-16 py-20 text-center">
                <h2 className="text-5xl text-[#b9a979] mb-12">Browse Meals</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <MealCard meal={{ name: "Grilled Chicken Wrap", provider: "The Deli Counter", time: "10 mins", tokens: 1, image: wrapImg}} />
                    <MealCard meal={{ name: "Veggie Pizza", provider: "Tony's Pizza", time: "15 mins", tokens: 2, image: pizzaImg}} />
                    <MealCard meal={{ name: "Spaghetti Bolognese", provider: "Bella Italia", time: "25 mins", tokens: 1, image: pastaImg}} />
                </div>
                <button className="py-10">
                <a href="/browsemeals" className="mt-20 border border-[#86aab4] px-6 py-3 rounded-md hover:bg-[#86aab4] hover:text-dark transition-all">
                    View All Available Meals
                </a>
                </button>
            </section>

        </div>
    )
}