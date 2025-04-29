"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, PlusCircle, Layers, ShoppingCart, Users, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"

const routes = [
  {
    label: "Products",
    icon: Package,
    href: "/products",
  },
  {
    label: "Add Product",
    icon: PlusCircle,
    href: "/products/add",
  },
  {
    label: "Add Variant",
    icon: Layers,
    href: "/variants/add",
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    href: "/orders",
  },
  {
    label: "Users",
    icon: Users,
    href: "/users",
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <Button
        ref={toggleButtonRef}
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      <div
        ref={sidebarRef}
        className={cn(
          "left-0 z-40 w-64 bg-background border-r transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-primary">Sneaker Admin</h1>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  pathname === route.href
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground">© 2025 Sneaker Admin</div>
          </div>
        </div>
      </div>
    </>
  )
}
