"use client"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Manage your sneaker store from one central location.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle>Products</CardTitle>
            <CardDescription>Manage your sneaker inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24 Products</div>
          </CardContent>
          <CardFooter>
            <Link href="/products" className="w-full">
              <Button className="w-full">
                View Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle>Orders</CardTitle>
            <CardDescription>View and manage customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Orders</div>
          </CardContent>
          <CardFooter>
            <Link href="/orders" className="w-full">
              <Button className="w-full">
                View Orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48 Users</div>
          </CardContent>
          <CardFooter>
            <Link href="/users" className="w-full">
              <Button className="w-full">
                View Users
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
