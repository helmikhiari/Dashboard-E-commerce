"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

export default function AddProductPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [gender, setGender] = useState("")
  const [onSale, setOnSale] = useState(false)
  const [salePercentage, setSalePercentage] = useState("")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!imageFile) {
      toast({ title: "Error", description: "Please upload a product image.", variant: "destructive" })
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append("image", imageFile)
    formData.append("name", name)
    formData.append("description", description)
    formData.append("price", price)
    formData.append("gender", gender)
    formData.append("onSale", onSale ? (1 - Number(salePercentage)).toString() : "1")

    try {
      const res = await fetch("http://localhost:5000/product/addproduct", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Failed to add product")
      }

      toast({ title: "Success", description: "Product added successfully." })
      router.push("/products")
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Product</h1>
        <p className="text-muted-foreground">Add a new sneaker product to your inventory</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={(value) => setGender(value)} required>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="men">Men</SelectItem>
                        <SelectItem value="women">Women</SelectItem>
                        <SelectItem value="unisex">Unisex</SelectItem>
                        <SelectItem value="kids">Kids</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="onSale" checked={onSale} onCheckedChange={setOnSale} />
                  <Label htmlFor="onSale">On Sale</Label>
                </div>

                {onSale && (
                  <div className="space-y-2">
                    <Label htmlFor="salePercentage">Sale Percentage</Label>
                    <Input
                      id="salePercentage"
                      type="number"
                      placeholder="e.g. 0.3 for 30%"
                      min="0"
                      max="1"
                      step="0.01"
                      value={salePercentage}
                      onChange={(e) => setSalePercentage(e.target.value)}
                      required={onSale}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Product Image</Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 h-[300px]">
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={imagePreview}
                          alt="Product preview"
                          fill
                          className="object-contain"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="absolute bottom-2 right-2"
                          onClick={() => {
                            setImagePreview(null)
                            setImageFile(null)
                          }}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-1">Drag and drop an image, or click to browse</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (max 2MB)</p>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          className="mt-4"
                          onClick={() => document.getElementById("image")?.click()}
                        >
                          Select Image
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/products")}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Product"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
