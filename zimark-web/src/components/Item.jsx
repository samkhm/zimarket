import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Item({ item, addCart }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="bg-white rounded-2xl h-fit shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden w-[160px] md:w-[250px]">
          <CardContent className="p-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 md:h-56 object-cover"
            />
          </CardContent>

          <CardHeader className="pb-0 px-3 md:px-4">
            <CardTitle className="text-base md:text-lg font-bold text-gray-800 truncate">
              {item.name}
            </CardTitle>

            <CardDescription
              className={`text-xs md:text-sm text-white flex rounded-full w-fit px-3 py-1 mt-1 ${
                item.available ? "bg-green-300" : "bg-red-300"
              }`}
            >
              {item.available ? "Available" : "Sold Out"}
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex items-center justify-between pt-2 px-3 md:px-4 pb-4">
            <p className="text-base md:text-xl font-semibold text-gray-800">
              Ksh. {item.price}
            </p>

            <Button
              size="sm"
              className="rounded-full bg-black text-white hover:bg-gray-800 text-xs md:text-sm px-3 py-1"
            >
              View
            </Button>
          </CardFooter>
        </Card>
      </DialogTrigger>

      {/* Product Modal */}
      <DialogContent className="max-w-lg rounded-2xl bg-white shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold">
            {item.name}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <img
            src={item.image}
            className="w-full h-56 md:h-72 object-cover rounded-lg shadow-sm"
          />

          <div className="flex justify-between items-center">
            <p className="text-xl md:text-2xl font-semibold text-gray-800">
              Ksh. {item.price}
            </p>

            <Button
              className="rounded-full border border-green-500 text-green-700 bg-gray-100 hover:bg-gray-800 hover:text-white px-5 md:px-6"
              onClick={() => addCart(item)}
            >
              Add to Cart
            </Button>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-semibold mb-1">Size</h3>
            <div className="flex gap-2">
              <span className="border border-gray-300 rounded-full px-3 py-1 text-sm cursor-pointer">
                {item.size}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
