
export default function MealCard({meal}) {
    return (
        <div className="border border-gray-600 p-5 rounded-md hover:border-tealish transition">
            <img src={meal.image} alt={meal.name} className="w-full h-48 object-cover" ></img>

            <div className="p-4 text-left">
                <h3 className="text-tealish text-lg font-semibold">{meal.name}</h3>
                <p className="text-sm">{meal.provider}</p>
                <p className="mt-2 text-sm">@ {meal.tokens} token</p>
                <button className="mt-3 border border-tealish text-tealish px-3 py-1 hover:bg-tealish hover:text-black transition">
                    Reserve
                </button>
            </div>
        </div>
    );
}