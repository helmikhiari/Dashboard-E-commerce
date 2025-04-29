"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useMobile } from "@/hooks/use-mobile"

// Mock data
const users = [
  {
    id: "1",
    avatar: "/placeholder.svg?height=40&width=40",
    name: "John Doe",
    email: "john.doe@example.com",
    registeredAt: "2025-01-15",
  },
  {
    id: "2",
    avatar: "/placeholder.svg?height=40&width=40",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    registeredAt: "2025-02-20",
  },
  {
    id: "3",
    avatar: "/placeholder.svg?height=40&width=40",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    registeredAt: "2025-03-10",
  },
  {
    id: "4",
    avatar: "/placeholder.svg?height=40&width=40",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    registeredAt: "2025-04-05",
  },
]

export default function UsersPage() {
  const [loading, setLoading] = useState(false)
  const isMobile = useMobile()

  if (loading) {
    return <UsersLoading />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">View and manage registered users</p>
      </div>

      {isMobile ? (
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id} className="border-muted bg-muted/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{user.name}</h3>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <div className="text-sm text-muted-foreground mt-1">Registered: {user.registeredAt}</div>
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
                <TableHead>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registered At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Image
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.registeredAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

function UsersLoading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">View and manage registered users</p>
      </div>

      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 rounded-md border p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
