"use client";

import { authClient } from "@/lib/auth-client";
import { getClient } from "@/lib/rpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { format } from "date-fns";
import {
  BadgeCheck,
  Bed,
  CalendarDays,
  Check,
  ChevronLeft,
  Clock,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateRoomBooking } from "../hooks/create-room-booking";

// Define the Zod schema for validation
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

interface RoomBookingStepsProps {
  hotelId: string;
  roomTypeId: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

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

// Stepper Component
const Stepper = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    {
      number: 1,
      title: "Your details",
      description: "Enter guest information and stay details",
    },
    {
      number: 2,
      title: "Final step",
      description: "Review and confirm your booking",
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-6">
      <div className="flex items-center justify-center max-w-md mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep >= step.number
                    ? "bg-[#003580] border-[#003580] text-white"
                    : "border-gray-300 text-gray-400 bg-white"
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              <div className="text-center mt-2">
                <p
                  className={`text-sm font-medium ${
                    currentStep >= step.number
                      ? "text-[#003580]"
                      : "text-gray-400"
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 transition-all duration-300 ${
                  currentStep > step.number ? "bg-[#003580]" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function RoomBookingSteps({
  hotelId,
  roomTypeId,
  onSuccess,
  onClose,
}: RoomBookingStepsProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [bookingResponse, setBookingResponse] = useState<any>(null);
  const [formData, setFormData] = useState<CreateRoomBookingInput | null>(null);
  const [roomTypeData, setRoomTypeData] = useState<any>(null);
  const [loadingRoomType, setLoadingRoomType] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
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

  // Fetch room type data when component mounts
  useEffect(() => {
    const fetchRoomType = async () => {
      if (!roomTypeId) return;

      setLoadingRoomType(true);
      try {
        const rpcClient = await getClient();
        const response = await rpcClient.api.rooms.types[":id"].$get({
          param: { id: roomTypeId },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch room type data");
        }
        const data = await response.json();
        setRoomTypeData(data);

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

  // Auto-fill user email from session
  useEffect(() => {
    if (session?.user?.email) {
      setValue("guestEmail", session.user.email);
    }
  }, [session, setValue]);

  // Commission calculation
  const commissionRate = 10;
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
      const totalPrice = amount * rooms;
      const commission = (totalPrice * commissionRate) / 100;
      const net = totalPrice - commission;

      setValue("commissionAmount", commission.toFixed(2));
      setValue("netPayableToHotel", net.toFixed(2));
    } else {
      setValue("commissionAmount", "");
      setValue("netPayableToHotel", "");
    }
  }, [totalAmount, numRooms, setValue]);

  const mutation = useCreateRoomBooking();

  // Step 1 form submission
  const onStepOneSubmit = async (data: RoomBookingFormValues) => {
    setError(null);

    // Final validation before submission
    if (data.numRooms > availableRoomsCount) {
      setError(
        `Cannot book ${data.numRooms} rooms. Only ${availableRoomsCount} rooms available.`
      );
      return;
    }

    try {
      const baseAmount = parseFloat(data.totalAmount || "0");
      const finalTotal = baseAmount * (data.numRooms || 1);

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
        currency: data.currency || "LKR",
        specialRequests: data.specialRequests || null,
        notes: data.notes || null,
        isPaid: data.isPaid || false,
        paymentDetails: data.paymentDetails || null,
      };

      const response = await mutation.mutateAsync(transformedData);
      setBookingResponse(response);
      setFormData(transformedData);
      setCurrentStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to create room booking");
    }
  };

  // Payment confirmation functions
  const createHotelPayment = async (paymentData: any) => {
    const rpcClient = await getClient();
    const response = await rpcClient.api["payments-hotel"].$post({
      json: paymentData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create hotel payment");
    }

    return await response.json();
  };

  const createAdminPayment = async (paymentData: any) => {
    const rpcClient = await getClient();
    const response = await rpcClient.api["payments-admin"].$post({
      json: paymentData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create admin payment");
    }

    return await response.json();
  };

  const handleConfirmPayment = async () => {
    if (
      !formData?.paymentType ||
      !formData?.totalAmount ||
      !formData?.hotelId
    ) {
      toast.error("Missing payment information");
      return;
    }

    setIsConfirmingPayment(true);

    try {
      const totalAmountStr = formData.totalAmount?.toString() || "";

      if (formData.paymentType === "cash") {
        const hotelPaymentData = {
          hotelId: formData.hotelId,
          bookingId: null,
          type: "booking_payment_cash",
          amount: totalAmountStr,
          dueDate: null,
          paid: null,
          paidAt: null,
        };

        await createHotelPayment(hotelPaymentData);
        toast.success("Hotel payment record created successfully");
      } else if (formData.paymentType === "online") {
        const adminPaymentData = {
          hotelId: formData.hotelId,
          bookingId: null,
          type: "booking_payment_online",
          method: null,
          amount: totalAmountStr,
          settled: null,
          settledAt: null,
        };

        await createAdminPayment(adminPaymentData);
        toast.success("Admin payment record created successfully");
      }

      setPaymentConfirmed(true);

      // Auto close after success
      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Payment confirmation failed");
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  // Helper function to format amount
  const formatAmount = (amount?: string | number) => {
    if (!amount) return "Not specified";
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return "Not specified";
    return `${numAmount.toFixed(2)} ${formData?.currency || "USD"}`;
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#003580]">
              Complete your booking
            </h1>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <Stepper currentStep={currentStep} />

        {currentStep === 1 && (
          <div className="flex gap-6 p-6">
            {/* Left Column - Form */}
            <div className="flex-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <form
                  onSubmit={handleSubmit(onStepOneSubmit)}
                  className="space-y-8"
                >
                  <input type="hidden" {...register("hotelId")} />
                  <input type="hidden" {...register("roomTypeId")} />

                  {/* Guest Information Section */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                      Enter your details
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full name *
                        </label>
                        <input
                          type="text"
                          {...register("guestName")}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#003580] focus:border-[#003580] outline-none"
                          disabled={isSubmitting}
                          placeholder="Enter your full name"
                        />
                        {errors.guestName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.guestName.message as string}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email address
                        </label>
                        <input
                          type="email"
                          {...register("guestEmail")}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#003580] focus:border-[#003580] outline-none"
                          disabled={isSubmitting}
                          placeholder="Enter your email"
                        />
                        {errors.guestEmail && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.guestEmail.message as string}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone number
                        </label>
                        <input
                          type="text"
                          {...register("guestPhone")}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#003580] focus:border-[#003580] outline-none"
                          disabled={isSubmitting}
                          placeholder="Enter your phone number"
                        />
                        {errors.guestPhone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.guestPhone.message as string}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stay Details Section */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                      Your stay
                    </h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Check-in date *
                        </label>
                        <input
                          type="date"
                          {...register("checkInDate")}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#003580] focus:border-[#003580] outline-none"
                          disabled={isSubmitting}
                        />
                        {errors.checkInDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.checkInDate.message as string}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Check-out date *
                        </label>
                        <input
                          type="date"
                          {...register("checkOutDate")}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#003580] focus:border-[#003580] outline-none"
                          disabled={isSubmitting}
                        />
                        {errors.checkOutDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.checkOutDate.message as string}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Check-in time
                        </label>
                        <input
                          type="time"
                          {...register("checkInTime")}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#003580] focus:border-[#003580] outline-none"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Check-out time
                        </label>
                        <input
                          type="time"
                          {...register("checkOutTime")}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#003580] focus:border-[#003580] outline-none"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          className={`w-full border rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#003580] focus:border-[#003580] outline-none ${
                            roomCountError
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          disabled={isSubmitting}
                        />
                        {errors.numRooms && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.numRooms.message as string}
                          </p>
                        )}
                        {roomCountError && (
                          <p className="text-red-500 text-sm mt-1">
                            {roomCountError}
                          </p>
                        )}
                        {availableRoomsCount === 0 && !loadingRoomType && (
                          <p className="text-red-500 text-sm mt-1">
                            No rooms available for this room type
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adults
                        </label>
                        <input
                          type="number"
                          min={1}
                          {...register("numAdults", { valueAsNumber: true })}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#003580] focus:border-[#003580] outline-none"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Children
                        </label>
                        <input
                          type="number"
                          min={0}
                          {...register("numChildren", { valueAsNumber: true })}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#003580] focus:border-[#003580] outline-none"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Section */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                      How do you want to pay?
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment method *
                        </label>
                        <select
                          {...register("paymentType")}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#003580] focus:border-[#003580] outline-none bg-white"
                          disabled={isSubmitting}
                        >
                          <option value="">Select payment method</option>
                          <option value="cash">Pay cash</option>
                          <option value="online">Pay online</option>
                        </select>
                        {errors.paymentType && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.paymentType.message as string}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price per room
                          {roomTypeData?.price && (
                            <span className="ml-2 text-xs text-green-600 font-medium">
                              Auto-filled
                            </span>
                          )}
                        </label>
                        <input
                          type="text"
                          {...register("totalAmount")}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#003580] focus:border-[#003580] outline-none"
                          disabled={isSubmitting}
                          placeholder={
                            roomTypeData?.price
                              ? `$${roomTypeData.price}`
                              : "Enter amount"
                          }
                        />
                      </div>

                      {/* Total Calculation Display */}
                      {watch("totalAmount") && watch("numRooms") > 1 && (
                        <div className="bg-[#e7f3ff] border border-[#003580] rounded-md p-4">
                          <p className="text-sm text-[#003580] font-medium">
                            <strong>
                              Total for {watch("numRooms")} rooms:
                            </strong>{" "}
                            LKR
                            {(
                              parseFloat(watch("totalAmount") || "0") *
                              (watch("numRooms") || 1)
                            ).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                      Special requests
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Please tell us if you have any special requests
                        </label>
                        <textarea
                          {...register("specialRequests")}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#003580] focus:border-[#003580] outline-none"
                          disabled={isSubmitting}
                          rows={4}
                          placeholder="Special requests are subject to availability upon check-in and may incur additional charges"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional notes
                        </label>
                        <textarea
                          {...register("notes")}
                          className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#003580] focus:border-[#003580] outline-none"
                          disabled={isSubmitting}
                          rows={3}
                          placeholder="Any additional information"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        mutation.isPending ||
                        loadingRoomType ||
                        availableRoomsCount === 0 ||
                        numRooms > availableRoomsCount
                      }
                      className="bg-[#003580] hover:bg-[#00224f] text-white px-8 py-3 rounded-md font-medium"
                    >
                      {isSubmitting || mutation.isPending
                        ? "Processing..."
                        : availableRoomsCount === 0
                          ? "No Rooms Available"
                          : numRooms > availableRoomsCount
                            ? "Exceeds Available Rooms"
                            : "Complete booking"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="w-80">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Your booking details
                </h3>

                {/* Room Type Info Display */}
                {roomTypeData && (
                  <div className="mb-6 pb-4 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {roomTypeData.name}
                    </h4>
                    {roomTypeData.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {roomTypeData.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      {roomTypeData.price && (
                        <p className="text-sm font-medium text-[#003580]">
                          LKR{roomTypeData.price} per room
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        {availableRoomsCount} rooms available
                      </p>
                    </div>
                  </div>
                )}

                {loadingRoomType && (
                  <div className="text-center text-[#003580] py-4 text-sm">
                    Loading room information...
                  </div>
                )}

                {/* Booking Summary */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium">
                      {watch("checkInDate") || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">
                      {watch("checkOutDate") || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rooms:</span>
                    <span className="font-medium">
                      {watch("numRooms") || 1}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span className="font-medium">
                      {watch("numAdults") || 1} adult(s)
                      {(watch("numChildren") || 0) > 0 &&
                        `, ${watch("numChildren")} child(ren)`}
                    </span>
                  </div>
                  {watch("totalAmount") && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-[#003580]">
                          LKR
                          {(
                            parseFloat(watch("totalAmount") || "0") *
                            (watch("numRooms") || 1)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && formData && bookingResponse && (
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="text-center space-y-4 mb-8">
                  <div className="flex items-center justify-center text-green-600 mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <BadgeCheck className="w-10 h-10 text-green-600" />
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Booking confirmed!
                  </h1>
                  <p className="text-lg text-gray-600">
                    Your reservation has been successfully created
                  </p>
                  <div className="bg-[#e7f3ff] border border-[#003580] rounded-md p-4 max-w-md mx-auto">
                    <p className="text-[#003580] font-medium">
                      Booking reference:{" "}
                      <span className="font-bold">{bookingResponse.id}</span>
                    </p>
                  </div>
                  {paymentConfirmed && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 max-w-md mx-auto">
                      <p className="text-green-800 font-medium">
                        ✓ Payment confirmed
                      </p>
                      <p className="text-green-600 text-sm">
                        {formData.paymentType === "cash"
                          ? "Hotel payment record created successfully"
                          : "Online payment processed successfully"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Booking Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        Booking details
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <CalendarDays className="w-5 h-5 text-[#003580] mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Check-in
                            </p>
                            <p className="text-gray-600">
                              {formData.checkInDate
                                ? format(
                                    new Date(formData.checkInDate),
                                    "EEEE, MMMM d, yyyy"
                                  )
                                : "Not specified"}
                            </p>
                            {formData.checkInTime && (
                              <p className="text-sm text-gray-500">
                                {formData.checkInTime}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-[#003580] mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Check-out
                            </p>
                            <p className="text-gray-600">
                              {formData.checkOutDate
                                ? format(
                                    new Date(formData.checkOutDate),
                                    "EEEE, MMMM d, yyyy"
                                  )
                                : "Not specified"}
                            </p>
                            {formData.checkOutTime && (
                              <p className="text-sm text-gray-500">
                                {formData.checkOutTime}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Bed className="w-5 h-5 text-[#003580] mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Accommodation
                            </p>
                            <p className="text-gray-600">
                              {formData.numRooms || 1} room(s)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Users className="w-5 h-5 text-[#003580] mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Guests
                            </p>
                            <p className="text-gray-600">
                              {formData.numAdults || 1} adult(s)
                              {(formData.numChildren ?? 0) > 0 &&
                                `, ${formData.numChildren} child(ren)`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        Guest information
                      </h3>
                      <div className="space-y-2">
                        <p className="text-gray-900 font-medium">
                          {formData.guestName || "Not specified"}
                        </p>
                        <p className="text-gray-600">
                          {formData.guestEmail || "Not specified"}
                        </p>
                        <p className="text-gray-600">
                          {formData.guestPhone || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {formData.specialRequests && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                          Special requests
                        </h3>
                        <p className="text-gray-600">
                          {formData.specialRequests}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Payment Summary */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        Payment summary
                      </h3>
                      <div className="bg-gray-50 rounded-md p-6">
                        <div className="flex flex-col items-center gap-4 mb-6">
                          <CreditCard className="w-12 h-12 text-[#003580]" />
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">
                              {formatAmount(formData.totalAmount)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Total amount
                            </p>
                          </div>
                          <div className="px-4 py-2 bg-white rounded-md border border-gray-200">
                            <p className="text-sm font-medium text-gray-900">
                              {formData.paymentType === "cash"
                                ? "Pay cash"
                                : "Paid online"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm border-t border-gray-200 pt-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Room price</span>
                            <span className="font-medium text-gray-900">
                              {formatAmount(formData.totalAmount)}
                            </span>
                          </div>
                          {/* {formData.commissionAmount && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Commission</span>
                              <span className="font-medium text-gray-900">
                                {formatAmount(formData.commissionAmount)}
                              </span>
                            </div>
                          )} */}
                          {/* {formData.netPayableToHotel && (
                            <div className="flex justify-between border-t border-gray-200 pt-3">
                              <span className="text-gray-600">
                                Net payable to hotel
                              </span>
                              <span className="font-medium text-gray-900">
                                {formatAmount(formData.netPayableToHotel)}
                              </span>
                            </div>
                          )} */}
                          {paymentConfirmed && (
                            <div className="flex justify-between bg-green-50 border border-green-200 rounded-md px-3 py-2 mt-3">
                              <span className="text-green-700 font-medium">
                                Payment status
                              </span>
                              <span className="font-medium text-green-800">
                                {formData.paymentType === "online"
                                  ? "Confirmed"
                                  : "Pending at property"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {!paymentConfirmed &&
                      formData.paymentType &&
                      formData.totalAmount && (
                        <div className="bg-[#e7f3ff] border border-[#003580] rounded-md p-4">
                          <p className="text-sm text-[#003580] mb-3">
                            Complete your booking by confirming the payment
                          </p>
                          <Button
                            onClick={handleConfirmPayment}
                            disabled={isConfirmingPayment}
                            className="w-full bg-[#003580] hover:bg-[#00224f] text-white"
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            {isConfirmingPayment
                              ? "Processing..."
                              : "Confirm payment"}
                          </Button>
                        </div>
                      )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-8">
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      disabled={isConfirmingPayment || paymentConfirmed}
                      className="border-gray-300 text-gray-700"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Back to details
                    </Button>

                    {paymentConfirmed && (
                      <Button
                        onClick={() => {
                          if (onSuccess) onSuccess();
                          if (onClose) onClose();
                        }}
                        className="bg-[#003580] hover:bg-[#00224f] text-white"
                      >
                        Close
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
