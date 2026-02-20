"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

interface UpgradeModalProps {
    open:boolean;
    onOpenChange: (open:boolean)=>void
}

export const UpgradeModal = ({
    open, onOpenChange
}:UpgradeModalProps)=>{
    const router = useRouter()

    const handleUpgrade = () => {
        // Redirect to your pricing page or Stripe checkout
        router.push('/pricing')
        onOpenChange(false)
    }

    return(
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Upgrade To Pro</AlertDialogTitle>
                    <AlertDialogDescription>
                        You need an active subscription to perform this action.
                        Upgrade to Pro to unlock all features.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleUpgrade}>
                        Upgrade Now
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}