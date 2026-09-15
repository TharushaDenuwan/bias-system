"use client";

import { MoreHorizontal, UserPenIcon } from "lucide-react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

import { deleteHotel } from "@/features/admin/hotel-management/api/use-delete-hotels";
import { HotelSelectType } from "@/features/hotels/schemas/hotel.schema";

interface CellActionProps {
  data: HotelSelectType;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isUpdateOpen, setUpdateOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteHotel(data.id);
      toast.success("Hotel deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete hotel");
    }
  };

  return (
    <>
      {/* Update Sheet */}
      {/* <UpdateUserSheet
        open={isUpdateOpen}
        setOpen={setUpdateOpen}
        updateUserId={data.id}
      /> */}

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {/* Update Sheet */}
          <DropdownMenuItem onClick={() => setUpdateOpen(true)}>
            <UserPenIcon className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>

          {/* Delete Action */}
          <DropdownMenuItem onClick={handleDelete}>
            <UserPenIcon className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ToastContainer />
    </>
  );
};
