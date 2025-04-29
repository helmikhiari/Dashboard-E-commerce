"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ChevronUp, Edit, Trash, Plus, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useMobile } from "@/hooks/use-mobile"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

type ProductDetails = {
  _id: string;
  size: number;
  stock: number;
};

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  gender: string;
  image: string;
  onSale: number;
  productDetails: ProductDetails[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const isMobile = useMobile()
  const { toast } = useToast()

  const toggleExpand = (productId: string) => {
    setExpandedProduct(expandedProduct === productId ? null : productId)
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:5000/product/getallproducts")
        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleDelete = async () => {
    if (!deleteProductId) return

    setDeleting(true)
    try {
      const res = await fetch(`http://localhost:5000/product/deleteproduct/${deleteProductId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete product")
      }

      setProducts(products.filter((p) => p._id !== deleteProductId))
      toast({ title: "Deleted", description: "Product deleted successfully." })
      setDeleteProductId(null)
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Failed to delete product.", variant: "destructive" })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-muted bg-muted/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* --- Header and Add button --- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your sneaker inventory</p>
        </div>
        <Link href="/products/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* --- Products list --- */}
      {isMobile ? (
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product._id} className="border-muted bg-muted/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteProductId(product._id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium">${product.price}</span>
                      {product.onSale > 0 && (
                        <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                          <Tag className="h-3 w-3 mr-1" />
                          Sale
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{product.gender}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sneaker Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>On Sale</TableHead>
                <TableHead>Variants</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <>
                  <TableRow key={product._id}>
                    <TableCell>
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {product.onSale > 0 ? (
                          <div className="flex flex-col">
                            <span className="text-muted-foreground line-through text-sm">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="text-primary font-semibold">
                              ${(product.price * (product.onSale)).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span>${product.price.toFixed(2)}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{product.gender}</TableCell>
                    <TableCell>{product.onSale > 0 ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toggleExpand(product._id)}>
                        {expandedProduct === product._id ? (
                          <ChevronUp className="h-4 w-4 mr-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 mr-2" />
                        )}
                        {product.productDetails.length} Variants
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteProductId(product._id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedProduct === product._id && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                        <div className="p-4 bg-muted/30">
                          <div className="grid grid-cols-2 gap-4 max-w-md">
                            <div className="font-medium">Size</div>
                            <div className="font-medium">Stock</div>
                            {product.productDetails.map((variant) => (
                              <>
                                <div key={variant._id}>{variant.size}</div>
                                <div key={variant._id + "-stock"}>{variant.stock}</div>
                              </>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* --- Confirm Delete Modal --- */}
      <Dialog open={!!deleteProductId} onOpenChange={(open) => !open && setDeleteProductId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this product?</div>
          <DialogFooter className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setDeleteProductId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
