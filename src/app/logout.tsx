"use client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export const LogoutButton = () => {

    const router = useRouter()
    return(
        <Button >
            Logout
        </Button>
    )
}

