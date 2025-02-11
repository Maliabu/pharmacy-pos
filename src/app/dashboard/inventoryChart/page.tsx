export default function Page(){
    return<div className="bg-background p-8 rounded-lg mt-2">
        <div className="grid sm:grid-cols-3 gap-2">
            <div className="p-6 bg-lime-600 text-lime-200 rounded-lg">
                <div className="text-5xl font-bold tracking-tight">
                    4
                </div>
                <span>Active Stock</span>
                <div className="text-sm leading-4 text-lime-200 p-3 rounded-md bg-lime-500 mt-4">Passed quality checks and Ready for dispatch or use</div>
            </div>
            <div className="p-6 bg-muted rounded-lg">
                <div className="text-5xl font-bold tracking-tight">
                    4
                </div>
                <span>Quarantine stock</span>
                <div className="text-sm leading-4 text-gray-200 p-3 rounded-md bg-gray-500 mt-4">Pending quality checks and NOT Ready for dispatch or use</div>
            </div>
            <div className="p-6 bg-red-600 text-red-200 rounded-lg">
                <div className="text-5xl font-bold tracking-tight">
                    4
                </div>
                <span>Buffer/Safety Stock</span>
                <div className="text-sm leading-4 text-red-200 p-3 rounded-md bg-red-500 mt-4">Set Aside for emergency</div>
            </div>
        </div>
        <div>
            <div className="text-2xl tracking-tight font-bold mt-8">Stock Overview</div>
        </div>
    </div>
}