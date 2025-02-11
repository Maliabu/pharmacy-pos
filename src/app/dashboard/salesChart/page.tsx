import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Product } from "../products/dataColumns";

export default function Page(){

    const expires: Product[] = [
        {
            id: "1",
            orderDate: "25 feb 2025",
            name: "paracetamol",
            description: "pain killers",
            supplierVendor: "medic pharm",
            currency: "ugx",
            unitAmount: 2500,
            unitsPurchased: 6,
            price: 3000,
            unit: "box",
            expiryDate: "25 feb 2027"
        },
        {
            id: "2",
            orderDate: "25 feb 2025",
            name: "vitamin c",
            description: "pain killers",
            supplierVendor: "medic pharm",
            currency: "ugx",
            unitAmount: 2500,
            price: 3000,
            unitsPurchased: 6,
            unit: "box",
            expiryDate: "25 feb 2027"
        },
        {
            id: "3",
            orderDate: "25 feb 2025",
            name: "paracetamol",
            description: "pain killers",
            supplierVendor: "medic pharm",
            currency: "ugx",
            unitAmount: 2500,
            unitsPurchased: 6,
            price: 3000,
            unit: "box",
            expiryDate: "25 feb 2027"
        },
        {
            id: "4",
            orderDate: "25 feb 2025",
            name: "mabendazol",
            description: "pain killers",
            supplierVendor: "medic pharm",
            currency: "ugx",
            unitAmount: 2500,
            unitsPurchased: 6,
            price: 3000,
            unit: "box",
            expiryDate: "25 feb 2027"
        },
    ]
    return<div className="bg-background p-8 rounded-lg mt-2">
        <div className="grid sm:grid-cols-3 gap-2">
            <div className="p-6 bg-primary text-lime-300 rounded-lg">
                <div className="text-5xl font-bold tracking-tight">
                    4
                </div>
                <span>Products</span>
                <div className="text-sm leading-4 text-lime-300 p-3 rounded-md bg-lime-600 mt-4">Total products in stock</div>
            </div>
            <div className="p-2 bg-red-600 text-red-200 rounded-lg col-span-2">
                <div className="flex justify-between items-center p-2 border-b border-red-400">
                <div className="text-base font-bold tracking-tight leading-4">Stock due for Expiry (14 days window)</div>
                <div className="h-10 w-10 rounded-full bg-red-500 text-red-200 flex justify-center items-center">5</div>
                </div>
                <Carousel className="sm:w-full w-[300px] sm:px-12 sm:py-6">
                <CarouselContent className="-ml-1">
                    {expires.map((product) => (
                    <CarouselItem key={product.id} className="pl-1 md:basis-1/2 lg:basis-1/3">
                        <div className="">
                        <Card className="shadow-none border-none bg-red-500 text-red-200 rounded-md">
                            <CardContent className="flex flex-col items-center justify-center p-3">
                            <span className="text-base font-semibold">{product.name}</span>
                            <div>{product.expiryDate}</div>
                            </CardContent>
                        </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="ml-12 text-red-200 border bg-red-500 border-red-500 hover:bg-red-500 hover:text-red-300" />
                <CarouselNext className="mr-12 text-red-200 border bg-red-500 border-red-500 hover:bg-red-500 hover:text-red-300" />
                </Carousel>
            </div>
        </div>
        <div>
            <div className="text-2xl tracking-tight font-bold mt-8">Sales Overview</div>
        </div>
    </div>
}