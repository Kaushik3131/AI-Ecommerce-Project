"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProduct } from "@/lib/actions/admin-mutations";
import { toast } from "sonner";

export function CreateProductButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState("");

  const handleCreate = () => {
    if (!productName.trim()) {
      toast.error("Please enter a product name");
      return;
    }

    startTransition(async () => {
      const result = await createProduct(productName.trim());

      if (result.success && result.productId) {
        toast.success(
          "Draft product created! Add images and details in Studio, then publish.",
          {
            duration: 5000,
          },
        );
        setOpen(false);
        setProductName("");
        router.push(`/admin/inventory/${result.productId}`);
      } else {
        toast.error(`Failed to create product: ${result.error}`);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>
            Enter a name for your new product. You can add more details after
            creation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="e.g., Modern Oak Dining Table"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isPending) {
                  handleCreate();
                }
              }}
              disabled={isPending}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isPending || !productName.trim()}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
