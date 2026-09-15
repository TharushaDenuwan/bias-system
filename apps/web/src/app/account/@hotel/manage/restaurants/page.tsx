"use client";

import { useGetMyRestaurant } from "@/features/resturant/actions/use-get-my-restaurant";
import { CreateRestaurantDialog } from "@/features/resturant/components/new-restaurant-form";
import { ManageRestaurantImages } from "@/features/resturant/components/restaurant-images";
import { RestaurantList } from "@/features/resturant/components/restaurant-list";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function ManageRestaurantsPage() {
  const [createRestaurantDialogOpen, setCreateRestaurantDialogOpen] =
    useState(false);
  const { data: myRestaurant, isLoading: loadingMyRestaurant } =
    useGetMyRestaurant();

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Restaurants</h1>
          <p className="text-muted-foreground">
            Add and manage restaurants for your hotel.
          </p>
        </div>
        <Dialog
          open={createRestaurantDialogOpen}
          onOpenChange={setCreateRestaurantDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-sm">
              <Plus className="h-4 w-4 mr-2" />
              New Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl h-fit">
            <ScrollArea className="h-full max-h-[90vh]">
              <DialogHeader className="mb-3">
                <DialogTitle>Create Restaurant</DialogTitle>
              </DialogHeader>
              <CreateRestaurantDialog
                onSuccess={() => setCreateRestaurantDialogOpen(false)}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="rounded-sm bg-secondary/45">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Restaurants</CardTitle>
          <CardDescription>
            View and manage all restaurants associated with your hotel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RestaurantList />
        </CardContent>
      </Card>

      {/* Images Section - always show */}
      <section>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Restaurant Images</CardTitle>
            <CardDescription>
              Manage images for your restaurant types.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ManageRestaurantImages restaurantId={myRestaurant?.id || ""} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
