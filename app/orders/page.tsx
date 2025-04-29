"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useMobile } from "@/hooks/use-mobile"

// Mock data
const orders = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    products: [
      { name: "Air Jordan 1", size: "42", quantity: 1, image: "/placeholder.svg?height=40&width=40" },
      { name: "Nike Air Max 90", size: "41", quantity: 1, image: "/placeholder.svg?height=40&width=40" },
    ],
    total: 329.98,
    createdAt: "2025-04-25",
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    products: [{ name: "Yeezy Boost 350", size: "39", quantity: 1, image: "/placeholder.svg?height=40&width=40" }],
    total: 249.99,
    createdAt: "2025-04-26",
  },
  {
    id: "ORD-003",
    customerName: "Mike Johnson",
    customerEmail: "mike.johnson@example.com",
    products: [
      { name: "Air Jordan 1", size: "43", quantity: 1, image: "/placeholder.svg?height=40&width=40" },
      { name: "Yeezy Boost 350", size: "41", quantity: 2, image: "/placeholder.svg?height=40&width=40" },
    ],
    total: 699.97,
    createdAt: "2025-04-27",
  },
]

export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isMobile = useMobile()

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  if (loading) {
    return <OrdersLoading />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">View and manage customer orders</p>
      </div>

      {isMobile ? (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="border-muted bg-muted/20">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{order.id}</h3>
                    <span className="text-sm font-medium">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="text-sm">
                    <div>{order.customerName}</div>
                    <div className="text-muted-foreground">{order.customerEmail}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{order.createdAt}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between"
                    onClick={() => toggleExpand(order.id)}
                  >
                    {order.products.length} Product{order.products.length !== 1 ? "s" : ""}
                    {expandedOrder === order.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  {expandedOrder === order.id && (
                    <div className="mt-2 border rounded-md p-2 space-y-2 bg-background/50">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Size: {product.size} × {product.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                <TableHead>Order ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Customer Email</TableHead>
                <TableHead>Product(s) Ordered</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <>
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.customerEmail}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toggleExpand(order.id)}>
                        {expandedOrder === order.id ? (
                          <ChevronUp className="h-4 w-4 mr-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 mr-2" />
                        )}
                        {order.products.length} Product{order.products.length !== 1 ? "s" : ""}
                      </Button>
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>{order.createdAt}</TableCell>
                  </TableRow>
                  {expandedOrder === order.id && (
                    <TableRow>
                      <TableCell colSpan={6} className="p-0">
                        <div className="p-4 bg-muted/30 space-y-2">
                          {order.products.map((product, index) => (
                            <div key={index} className="flex items-center gap-4">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="rounded-md object-cover"
                              />
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  Size: {product.size} × {product.quantity}
                                </div>
                              </div>
                            </div>
                          ))}
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
    </div>
  )
}

function OrdersLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">View and manage customer orders</p>
      </div>

      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 rounded-md border p-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-4 w-[80px]" />
          </div>
        ))}
      </div>
    </div>
  )
}
