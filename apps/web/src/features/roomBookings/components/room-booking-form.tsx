"use client";

import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateRoomBooking } from "../hooks/create-room-booking";

import RoomBookingSummary from "./room-booking-summary";

// Define the Zod schema for validation (adjust fields as needed)
const roomBookingSchema = z.object({
  hotelId: z.string().min(1, "Hotel is required"),
  roomTypeId: z.string().min(1, "Room type is required"),
  guestName: z.string().min(1, "Guest name is required"),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().optional(),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  numRooms: z.coerce.number().min(1).default(1),
  numAdults: z.coerce.number().min(1).default(1),
  numChildren: z.coerce.number().min(0).default(0),
  paymentType: z.enum(["cash", "online"], {
    required_error: "Payment type is required",
    invalid_type_error: "Payment type must be either cash or online",
  }),
  totalAmount: z.string().optional(),
  commissionAmount: z.string().optional(),
  netPayableToHotel: z.string().optional(),
  currency: z.string().optional(),
  specialRequests: z.string().optional(),
  notes: z.string().optional(),
  isPaid: z.boolean().optional(),
  paymentDetails: z.any().optional(),
});

type RoomBookingFormValues = z.infer<typeof roomBookingSchema>;

interface RoomBookingFormProps {
  hotelId: string;
  roomTypeId: string;
  onSuccess?: () => void;
}

// Update the interface to include all required fields
export interface CreateRoomBookingInput {
  hotelId: string;
  roomTypeId: string;
  guestName: string;
  paymentType: "cash" | "online";
  guestEmail?: string | null;
  guestPhone?: string | null;
  checkInDate?: string | null;
  checkInTime?: string | null;
  checkOutDate?: string | null;
  checkOutTime?: string | null;
  numRooms?: number;
  numAdults?: number;
  numChildren?: number;
  totalAmount?: string | null;
  commissionAmount?: string | null;
  netPayableToHotel?: string | null;
  currency?: string | null;
  specialRequests?: string | null;
  notes?: string | null;
  isPaid?: boolean;
  paymentDetails?: any;
}

export default function RoomBookingForm({
  hotelId,
  roomTypeId,
  onSuccess,
}: RoomBookingFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [bookingResponse, setBookingResponse] = useState<any>(null);
  const [formData, setFormData] = useState<CreateRoomBookingInput | null>(null);
  const [roomTypeData, setRoomTypeData] = useState<any>(null);
  const [loadingRoomType, setLoadingRoomType] = useState(false);
  const [availableRoomsCount, setAvailableRoomsCount] = useState<number>(0);
  const [roomCountError, setRoomCountError] = useState<string | null>(null);

  // Get current session data
  const { data: session } = authClient.useSession();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError: setFormError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RoomBookingFormValues>({
    resolver: zodResolver(roomBookingSchema),
    defaultValues: {
      hotelId,
      roomTypeId,
      numRooms: 1,
      numAdults: 1,
      numChildren: 0,
    },
  });

  // Fetch room type data when component mounts or roomTypeId changes
  useEffect(() => {
    const fetchRoomType = async () => {
      if (!roomTypeId) return;

      setLoadingRoomType(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/rooms/types/${roomTypeId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch room type data");
        }
        const data = await response.json();
        setRoomTypeData(data);

        // Auto-populate total amount if price is available
        if (data.price) {
          setValue("totalAmount", data.price.toString());
        }

        // Get available rooms count (count rooms with status 'available')
        const availableRooms =
          data.rooms?.filter((room: any) => room.status === "available") || [];
        setAvailableRoomsCount(availableRooms.length);
      } catch (err) {
        console.error("Error fetching room type:", err);
        setError("Failed to load room type information");
      } finally {
        setLoadingRoomType(false);
      }
    };

    fetchRoomType();
  }, [roomTypeId, setValue]);

  // Auto-fill only user email from session
  useEffect(() => {
    if (session?.user?.email) {
      setValue("guestEmail", session.user.email);
    }
  }, [session, setValue]);

  // Read commission rate from env (default to 10 if not set)
  const commissionRate =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_COMMISSION_AMOUNT
      ? parseFloat(process.env.NEXT_PUBLIC_COMMISSION_AMOUNT)
      : 10;

  // Watch totalAmount and numRooms to auto-calculate commission/net
  const totalAmount = watch("totalAmount");
  const numRooms = watch("numRooms");

  // Validate room count against available rooms
  useEffect(() => {
    const currentRoomsRequested = numRooms || 1;

    if (availableRoomsCount > 0) {
      if (currentRoomsRequested > availableRoomsCount) {
        setRoomCountError(
          `Only ${availableRoomsCount} rooms available for this room type`
        );
        setFormError("numRooms", {
          type: "manual",
          message: `Only ${availableRoomsCount} rooms available`,
        });
      } else {
        setRoomCountError(null);
        clearErrors("numRooms");
      }
    }
  }, [numRooms, availableRoomsCount, setFormError, clearErrors]);

  useEffect(() => {
    const amount = parseFloat(totalAmount || "");
    const rooms = numRooms || 1;

    if (!isNaN(amount)) {
      // Calculate total based on number of rooms
      const totalPrice = amount * rooms;
      const commission = (totalPrice * commissionRate) / 100;
      const net = totalPrice - commission;

      setValue("commissionAmount", commission.toFixed(2));
      setValue("netPayableToHotel", net.toFixed(2));
    } else {
      setValue("commissionAmount", "");
      setValue("netPayableToHotel", "");
    }
  }, [totalAmount, numRooms, commissionRate, setValue]);

  const mutation = useCreateRoomBooking();

  // Update the form submission to handle the data transformation properly
  const onSubmit = async (data: RoomBookingFormValues) => {
    setError(null);

    // Final validation before submission
    if (data.numRooms > availableRoomsCount) {
      setError(
        `Cannot book ${data.numRooms} rooms. Only ${availableRoomsCount} rooms available.`
      );
      return;
    }

    try {
      // Calculate final total amount based on rooms
      const baseAmount = parseFloat(data.totalAmount || "0");
      const finalTotal = baseAmount * (data.numRooms || 1);

      // Transform the form data to match the API expectations
      const transformedData: CreateRoomBookingInput = {
        hotelId: data.hotelId,
        roomTypeId: data.roomTypeId,
        guestName: data.guestName,
        paymentType: data.paymentType,
        guestEmail: data.guestEmail || null,
        guestPhone: data.guestPhone || null,
        checkInDate: data.checkInDate || null,
        checkInTime: data.checkInTime || null,
        checkOutDate: data.checkOutDate || null,
        checkOutTime: data.checkOutTime || null,
        numRooms: data.numRooms,
        numAdults: data.numAdults,
        numChildren: data.numChildren,
        totalAmount: finalTotal.toFixed(2),
        commissionAmount: data.commissionAmount || null,
        netPayableToHotel: data.netPayableToHotel || null,
        currency: data.currency || "USD",
        specialRequests: data.specialRequests || null,
        notes: data.notes || null,
        isPaid: data.isPaid || false,
        paymentDetails: data.paymentDetails || null,
      };

      const response = await mutation.mutateAsync(transformedData);

      // Store both the response and the form data for the summary
      setBookingResponse(response);
      setFormData(transformedData);

      reset();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to create room booking");
    }
  };

  if (bookingResponse && formData) {
    return (
      <RoomBookingSummary
        bookingId={bookingResponse.id}
        bookingData={{
          ...formData,
          id: bookingResponse.id,
          // Ensure we have the correct data structure
          ...bookingResponse,
        }}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-lg max-h-[80vh] overflow-y-auto p-4 bg-white rounded shadow-md border"
    >
      <input type="hidden" {...register("hotelId")} />
      <input type="hidden" {...register("roomTypeId")} />

      {/* Room Type Info Display */}
      {roomTypeData && (
        <section className="bg-blue-50 p-4 rounded border">
          <h3 className="font-semibold text-blue-800">Selected Room Type</h3>
          <p className="text-sm text-blue-600">{roomTypeData.name}</p>
          {roomTypeData.description && (
            <p className="text-xs text-gray-600 mt-1">
              {roomTypeData.description}
            </p>
          )}
          <div className="flex justify-between items-center mt-2">
            {roomTypeData.price && (
              <p className="text-sm font-semibold text-green-600">
                Base Price: ${roomTypeData.price} per room
              </p>
            )}
            <p className="text-sm font-semibold text-blue-600">
              Available Rooms: {availableRoomsCount}
            </p>
          </div>
        </section>
      )}

      {loadingRoomType && (
        <div className="text-center text-blue-600">
          Loading room type information...
        </div>
      )}

      {/* Guest Info Section */}
      <section>
        <h2 className="text-lg font-semibold mb-2 border-b pb-1">
          Guest Information
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block font-medium mb-1">Guest Name</label>
            <input
              type="text"
              {...register("guestName")}
              className="w-full border rounded px-3 py-2"
              disabled={isSubmitting}
              placeholder="Enter guest name"
            />
            {errors.guestName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.guestName.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Guest Email</label>
            <input
              type="email"
              {...register("guestEmail")}
              className="w-full border rounded px-3 py-2"
              disabled={isSubmitting}
              placeholder={
                session?.user?.email
                  ? "Auto-filled from profile"
                  : "Enter guest email"
              }
            />
            {errors.guestEmail && (
              <p className="text-red-500 text-sm mt-1">
                {errors.guestEmail.message as string}
              </p>
            )}
            {session?.user?.email && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Using your profile email: {session.user.email}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Guest Phone</label>
            <input
              type="text"
              {...register("guestPhone")}
              className="w-full border rounded px-3 py-2"
              disabled={isSubmitting}
              placeholder="Enter guest phone"
            />
            {errors.guestPhone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.guestPhone.message as string}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Stay Details Section */}
      <section>
        <h2 className="text-lg font-semibold mb-2 border-b pb-1">
          Stay Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Check-in Date</label>
            <input
              type="date"
              {...register("checkInDate")}
              className="w-full border rounded px-3 py-2"
              disabled={isSubmitting}
            />
            {errors.checkInDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.checkInDate.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Check-in Time</label>
            <input
              type="time"
              {...register("checkInTime")}
              className="w-full border rounded px-3 py-2"
              disabled={isSubmitting}
            />
            {errors.checkInTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.checkInTime.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Check-out Date</label>
            <input
              type="date"
              {...register("checkOutDate")}
              className="w-full border rounded px-3 py-2"
              disabled={isSubmitting}
            />
            {errors.checkOutDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.checkOutDate.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Check-out Time</label>
            <input
              type="time"
              {...register("checkOutTime")}
              className="w-full border rounded px-3 py-2"
              disabled={isSubmitting}
            />
            {errors.checkOutTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.checkOutTime.message as string}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block font-medium mb-1">
              Rooms{" "}
              {availableRoomsCount > 0 && (
                <span className="text-xs text-gray-500">
                  (Max: {availableRoomsCount})
                </span>
              )}
            </label>
            <input
              type="number"
              min={1}
              max={availableRoomsCount || 999}
              {...register("numRooms", { valueAsNumber: true })}
              className={`w-full border rounded px-3 py-2 ${
                roomCountError ? "border-red-500" : ""
              }`}
              disabled={isSubmitting}
            />
            {errors.numRooms && (
              <p className="text-red-500 text-sm mt-1">
                {errors.numRooms.message as string}
              </p>
            )}
            {roomCountError && (
              <p className="text-red-500 text-sm mt-1">{roomCountError}</p>
            )}
            {availableRoomsCount === 0 && !loadingRoomType && (
              <p className="text-red-500 text-sm mt-1">
                No rooms available for this room type
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Adults</label>
            <input
              type="number"
              min={1}
              {...register("numAdults", { valueAsNumber: true })}
              className="w-full border rounded px-3 py-2"
              disabled={isSubmitting}
            />
            {errors.numAdults && (
              <p className="text-red-500 text-sm mt-1">
                {errors.numAdults.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Children</label>
            <input
              type="number"
              min={0}
              {...register("numChildren", { valueAsNumber: true })}
              className="w-full border rounded px-3 py-2"
              disabled={isSubmitting}
            />
            {errors.numChildren && (
              <p className="text-red-500 text-sm mt-1">
                {errors.numChildren.message as string}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section>
        <h2 className="text-lg font-semibold mb-2 border-b pb-1">
          Payment & Financials
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block font-medium mb-1">Payment Type *</label>
            <select
              {...register("paymentType")}
              className="w-full border rounded px-3 py-2 bg-white"
              disabled={isSubmitting}
            >
              <option value="">Select payment type</option>
              <option value="cash">Cash</option>
              <option value="online">Online</option>
            </select>
            {errors.paymentType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.paymentType.message as string}
              </p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Price per Room
                {roomTypeData?.price && (
                  <span className="text-green-600 text-sm"> (Auto-filled)</span>
                )}
              </label>
              <input
                type="text"
                {...register("totalAmount")}
                className="w-full border rounded px-3 py-2"
                disabled={isSubmitting}
                placeholder={
                  roomTypeData?.price
                    ? `$${roomTypeData.price}`
                    : "Enter amount"
                }
              />
              {errors.totalAmount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.totalAmount.message as string}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">
                Commission Amount ({commissionRate}%)
              </label>
              <input
                type="text"
                {...register("commissionAmount")}
                className="w-full border rounded px-3 py-2 bg-gray-100"
                disabled
              />
              {errors.commissionAmount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.commissionAmount.message as string}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">
                Net Payable To Hotel
              </label>
              <input
                type="text"
                {...register("netPayableToHotel")}
                className="w-full border rounded px-3 py-2 bg-gray-100"
                disabled
              />
              {errors.netPayableToHotel && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.netPayableToHotel.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Total Calculation Display */}
          {watch("totalAmount") && watch("numRooms") > 1 && (
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Total for {watch("numRooms")} rooms:</strong> $
                {(
                  parseFloat(watch("totalAmount") || "0") *
                  (watch("numRooms") || 1)
                ).toFixed(2)}
              </p>
            </div>
          )}

          <div>
            <label className="block font-medium mb-1">Currency</label>
            <input
              type="text"
              {...register("currency")}
              className="w-full border rounded px-3 py-2"
              disabled={isSubmitting}
              defaultValue="USD"
            />
            {errors.currency && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currency.message as string}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section>
        <h2 className="text-lg font-semibold mb-2 border-b pb-1">
          Additional Information
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block font-medium mb-1">Special Requests</label>
            <textarea
              {...register("specialRequests")}
              className="w-full border rounded px-3 py-2"
              disabled={isSubmitting}
              rows={3}
            />
            {errors.specialRequests && (
              <p className="text-red-500 text-sm mt-1">
                {errors.specialRequests.message as string}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Notes</label>
            <textarea
              {...register("notes")}
              className="w-full border rounded px-3 py-2"
              disabled={isSubmitting}
              rows={3}
            />
            {errors.notes && (
              <p className="text-red-500 text-sm mt-1">
                {errors.notes.message as string}
              </p>
            )}
          </div>
        </div>
      </section>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50 w-full"
        disabled={
          isSubmitting ||
          mutation.isPending ||
          loadingRoomType ||
          availableRoomsCount === 0 ||
          numRooms > availableRoomsCount
        }
      >
        {isSubmitting || mutation.isPending
          ? "Booking..."
          : availableRoomsCount === 0
            ? "No Rooms Available"
            : numRooms > availableRoomsCount
              ? "Exceeds Available Rooms"
              : "Book Now"}
      </button>
    </form>
  );
}
