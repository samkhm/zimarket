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
    DialogDescription,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";

export default function Item({ item, addCart }){
    return(
        <Dialog>
        <DialogTrigger asChild>
          <Card className="bg-white h-fit rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden">
            <CardContent className="p-0">
              <img
                src={item.image}
                alt="Man Trouser"
                className="w-full h-56 object-cover"
              />
            </CardContent>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg font-bold text-gray-800">
                {item.name}
              </CardTitle>
              <CardDescription className={`text-sm text-white flex rounded-full w-fit p-2 items-center justify-center ${ item.available ? "bg-green-300" : "bg-red-200"}`}>
                { item.available ? "Available" : "Sold out"}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex items-center justify-between pt-2 gap-5">
              <p className="text-xl font-semibold text-gray-800">Ksh. {item.price}</p>
              <Button size="sm" className="rounded-full bg-black text-white hover:bg-gray-800">
                View
              </Button>
            </CardFooter>
          </Card>
        </DialogTrigger>
        

        {/* Product Modal */}
        <DialogContent className="max-w-lg rounded-2xl bg-white shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{item.name}</DialogTitle>
 
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <img
              src={item.image}
              
              className="w-full h-72 object-cover rounded-lg shadow-sm"
            />

            <div className="flex justify-between items-center">
              <p className="text-2xl font-semibold text-gray-800">Ksh. {item.price}</p>
              <Button className="rounded-full border-3 border-green-500 text-green-700 bg-gray-100 hover:bg-gray-800 hover:text-white px-6"
              onClick={() => addCart(item)}
              >
                Add to Cart
              </Button>
            </div>

       

            <div>
              <h3 className="text-lg font-semibold mb-1">Size</h3>
              <div className="flex gap-2">
                
                  <span
                    
                    className="border border-gray-300 rounded-full px-3 py-1 text-sm cursor-pointer hover:bg-gray-100"
                  >
                    {item.size}
                  </span>
                
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
}