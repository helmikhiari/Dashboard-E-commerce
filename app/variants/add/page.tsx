"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface Product {
  _id: string
  name: string
  image: string
}

interface VariantPair {
  id: string
  size: string
  stock: string
}

export default function AddVariantPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState("")
  const [variantPairs, setVariantPairs] = useState<VariantPair[]>([{ id: "1", size: "", stock: "" }])

  // Fetch Products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:5000/product/getallproducts")
        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error(error)
        toast({ title: "Error", description: "Failed to load products.", variant: "destructive" })
      } finally {
        setLoadingProducts(false)
      }
    }
    fetchProducts()
  }, [toast])

  const addVariantPair = () => {
    setVariantPairs([...variantPairs, { id: Date.now().toString(), size: "", stock: "" }])
  }

  const removeVariantPair = (id: string) => {
    if (variantPairs.length > 1) {
      setVariantPairs(variantPairs.filter((pair) => pair.id !== id))
    }
  }

  const updateVariantPair = (id: string, field: "size" | "stock", value: string) => {
    setVariantPairs(variantPairs.map((pair) => (pair.id === id ? { ...pair, [field]: value } : pair)))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedProduct) {
      toast({ title: "Error", description: "Please select a product.", variant: "destructive" })
      return
    }

    setLoadingSubmit(true)

    try {
      for (const pair of variantPairs) {
        const payload = {
          productID: selectedProduct,
          size: Number(pair.size),
          stock: Number(pair.stock),
        }

        const res = await fetch("http://localhost:5000/product/addproductdetails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          throw new Error(`Failed to add variant for size ${pair.size}`)
        }
      }

      toast({ title: "Success", description: "Variants added successfully." })
      router.push("/products")
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Failed to add variants.", variant: "destructive" })
    } finally {
      setLoadingSubmit(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Variant</h1>
        <p className="text-muted-foreground">Add size and stock variants to an existing product</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Product Select */}
            <div className="space-y-2">
              <Label htmlFor="product">Select Product</Label>
              {loadingProducts ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={selectedProduct} onValueChange={setSelectedProduct} required>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product._id} value={product._id}>
                        <div className="flex items-center gap-2">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={24}
                            height={24}
                            className="rounded-md object-cover"
                          />
                          <span>{product.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Size and Stock Pairs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Size and Stock Pairs</h3>
                <Button type="button" variant="outline" size="sm" onClick={addVariantPair}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Pair
                </Button>
              </div>

              <div className="space-y-4">
                {variantPairs.map((pair) => (
                  <div key={pair.id} className="flex items-center gap-4">
                    <div className="w-1/3">
                      <Input
                        id={`size-${pair.id}`}
                        placeholder="Size (e.g. 42)"
                        value={pair.size}
                        onChange={(e) => updateVariantPair(pair.id, "size", e.target.value)}
                        required
                      />
                    </div>
                    <div className="w-1/3">
                      <Input
                        id={`stock-${pair.id}`}
                        type="number"
                        placeholder="Stock"
                        min="0"
                        value={pair.stock}
                        onChange={(e) => updateVariantPair(pair.id, "stock", e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariantPair(pair.id)}
                      disabled={variantPairs.length === 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/products")}>
                Cancel
              </Button>
              <Button type="submit" disabled={loadingSubmit || !selectedProduct}>
                {loadingSubmit ? "Adding..." : "Add Variants"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
