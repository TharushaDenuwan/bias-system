"use client";

import React, { useCallback, useState } from "react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/components/select";
import { Switch } from "@repo/ui/components/switch";
import { Textarea } from "@repo/ui/components/textarea";
import { cn } from "@repo/ui/lib/utils";
import { Edit, Plus, Trash2 } from "lucide-react";

import { Skeleton } from "@repo/ui/components/skeleton";
import { useAddHotelPolicies } from "../../queries/use-add-hotel-policies";
import { useGetHotelPolicies } from "../../queries/use-get-hotel-policies";
import {
  type HotelPolicy,
  type InsertHotelPolicyType
} from "../../schemas/hotel.schema";

type Props = {
  className?: string;
};

const policyTypes = [
  { value: "cancellation", label: "Cancellation Policy" },
  { value: "pet", label: "Pet Policy" },
  { value: "smoking", label: "Smoking Policy" },
  { value: "checkin", label: "Check-in Policy" },
  { value: "checkout", label: "Check-out Policy" },
  { value: "payment", label: "Payment Policy" },
  { value: "damage", label: "Damage Policy" },
  { value: "noise", label: "Noise Policy" },
  { value: "guest", label: "Guest Policy" },
  { value: "other", label: "Other" }
];

const defaultPolicyValues: InsertHotelPolicyType = {
  hotelId: "",
  policyType: "",
  policyText: "",
  effectiveDate: new Date().toISOString().split("T")[0],
  isActive: true
};

export function ManageHotelPolicies({ className }: Props) {
  const { data, isLoading, error } = useGetHotelPolicies();
  const { mutate, isPending } = useAddHotelPolicies();

  const [policies, setPolicies] = useState<InsertHotelPolicyType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] =
    useState<InsertHotelPolicyType>(defaultPolicyValues);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setEditingIndex(null);
    setFormData(defaultPolicyValues);
  }, []);

  const handleEditPolicy = useCallback((policy: HotelPolicy, index: number) => {
    setEditingIndex(index);
    setFormData({
      hotelId: policy.hotelId,
      policyType: policy.policyType,
      policyText: policy.policyText,
      effectiveDate: policy.effectiveDate,
      isActive: policy.isActive
    });
    setIsDialogOpen(true);
  }, []);

  const handleDeletePolicy = useCallback((index: number) => {
    setPolicies((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSaveChanges = useCallback(() => {
    mutate(policies);
  }, [mutate, policies]);

  const openDialog = useCallback(() => {
    setEditingIndex(null);
    setFormData(defaultPolicyValues);
    setIsDialogOpen(true);
  }, []);

  const handleSubmitPolicy = useCallback(() => {
    if (!formData.policyType || !formData.policyText) {
      return; // Basic validation
    }

    if (editingIndex !== null) {
      // Update existing policy
      setPolicies((prev) => {
        const updated = [...prev];
        updated[editingIndex] = formData;
        return updated;
      });
    } else {
      // Add new policy
      setPolicies((prev) => [...prev, formData]);
    }

    handleCloseDialog();
  }, [formData, editingIndex, handleCloseDialog]);

  // Initialize policies from data
  React.useEffect(() => {
    if (data && !isLoading && !error) {
      const convertedPolicies: InsertHotelPolicyType[] = data.map((policy) => ({
        hotelId: policy.hotelId,
        policyType: policy.policyType,
        policyText: policy.policyText,
        effectiveDate: policy.effectiveDate,
        isActive: policy.isActive
      }));
      setPolicies(convertedPolicies);
    }
  }, [data, isLoading, error]);

  return (
    <>
      <Card className={cn("p-3 pt-5 rounded-sm shadow-none", className)}>
        <CardHeader>
          <CardTitle className="text-xl">Manage Hotel Policies</CardTitle>
          <CardDescription>
            Manage policies for your hotel listings such as cancellation, pet
            policies, etc.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="w-full h-16 rounded-sm" />
              <Skeleton className="w-full h-16 rounded-sm" />
              <Skeleton className="w-full h-16 rounded-sm" />
            </div>
          )}

          {error && <p className="text-destructive">{error.message}</p>}

          {policies.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No policies added yet
              </p>
              <Button onClick={openDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Policy
              </Button>
            </div>
          )}

          {policies.length > 0 && (
            <div className="space-y-4 bg-secondary/40 p-3 rounded-sm">
              {policies.map((policy, index) => (
                <Card key={index} className="border rounded-sm px-5 py-3">
                  <CardContent className="p-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{policy.policyText}</h4>

                          <p className="text-sm text-muted-foreground">
                            {" - "}
                            {policyTypes.find(
                              (t) => t.value === policy.policyType
                            )?.label || policy.policyType}
                          </p>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Effective from:{" "}
                          {policy.effectiveDate &&
                            new Date(policy.effectiveDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleEditPolicy(policy as HotelPolicy, index)
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePolicy(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button variant="outline" onClick={openDialog} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Another Policy
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-end">
          <Button
            loading={isPending}
            disabled={isPending || policies.length === 0}
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? "Edit Policy" : "Add New Policy"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitPolicy();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="policyType">Policy Type</Label>
              <Select
                value={formData.policyType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, policyType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a policy type" />
                </SelectTrigger>
                <SelectContent>
                  {policyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="policyText">Policy Text</Label>
              <Textarea
                placeholder="Enter the policy details..."
                className="resize-none"
                rows={4}
                value={formData.policyText}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    policyText: e.target.value
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="effectiveDate">Effective Date</Label>
              <Input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    effectiveDate: e.target.value
                  }))
                }
              />
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Active Policy</Label>
                <div className="text-sm text-muted-foreground">
                  This policy is currently active and will be displayed to
                  guests
                </div>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingIndex !== null ? "Update Policy" : "Add Policy"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
