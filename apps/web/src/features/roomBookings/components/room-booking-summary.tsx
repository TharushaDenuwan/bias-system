"use client";

import { Card } from "@repo/ui/components/card";
import { format } from "date-fns";
import {
  BadgeCheck,
  Bed,
  CalendarDays,
  Clock,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetRoomBookings } from "../actions/get-room-booking";

interface RoomBookingSummaryProps {
  bookingId: string;
  // Add option to pass booking data directly from the form
  bookingData?: any;
}

export default function RoomBookingSummary({
  bookingId,
  bookingData: passedBookingData,
}: RoomBookingSummaryProps) {
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Fetch booking details using the bookingId only if no data is passed
  const {
    data: fetchedBookingData,
    isLoading,
    error,
  } = useGetRoomBookings({
    search: bookingId,
  });

  // Use passed data if available, otherwise use fetched data
  const bookingData = passedBookingData || fetchedBookingData;

  if (!passedBookingData && isLoading) {
    return (
      <div className="p-8 text-center">
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!passedBookingData && (error || !bookingData)) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Failed to load booking details</p>
      </div>
    );
  }

  // Define the expected booking type
  interface Booking {
    id?: string;
    hotelId?: string;
    roomTypeId?: string;
    organizationId?: string;
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
    checkInDate?: string;
    checkInTime?: string;
    checkOutDate?: string;
    checkOutTime?: string;
    numRooms?: number;
    numAdults?: number;
    numChildren?: number;
    paymentType?: string;
    totalAmount?: string | number;
    commissionAmount?: string | number;
    netPayableToHotel?: string | number;
    currency?: string;
    specialRequests?: string;
  }

  // Get booking from passed data or fetched data
  const booking: Booking = passedBookingData || bookingData?.data?.[0] || {};

  if (!booking || Object.keys(booking).length === 0) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Booking not found.</p>
      </div>
    );
  }

  // Function to create hotel payment using fetch
  const createHotelPayment = async (paymentData: any) => {
    console.log("Sending hotel payment request:", paymentData);

    const response = await fetch("http://localhost:8000/api/payments-hotel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    console.log("Hotel payment response status:", response.status);

    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
        console.log("Raw hotel payment error response:", errorText);
      } catch (parseError) {
        console.log("Failed to parse error response:", parseError);
        errorText = `HTTP ${response.status} - ${response.statusText}`;
      }
      throw new Error(errorText);
    }

    const result = await response.json();
    console.log("Hotel payment success response:", result);
    return result;
  };

  // Function to create admin payment using fetch
  const createAdminPayment = async (paymentData: any) => {
    console.log("Sending admin payment request:", paymentData);

    const response = await fetch("http://localhost:8000/api/payments-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    console.log("Admin payment response status:", response.status);

    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
        console.log("Raw admin payment error response:", errorText);
      } catch (parseError) {
        console.log("Failed to parse error response:", parseError);
        errorText = `HTTP ${response.status} - ${response.statusText}`;
      }
      throw new Error(errorText);
    }

    const result = await response.json();
    console.log("Admin payment success response:", result);
    return result;
  };

  const handleConfirmPayment = async () => {
    if (!booking.paymentType || !booking.totalAmount || !booking.hotelId) {
      toast.error("Missing payment information");
      return;
    }

    setIsConfirmingPayment(true);

    try {
      const totalAmountStr = booking.totalAmount?.toString() || "";

      console.log("=== PAYMENT CONFIRMATION DEBUG ===");
      console.log("Full booking data:", booking);
      console.log("Payment type:", booking.paymentType);
      console.log("Hotel ID:", booking.hotelId);
      console.log("Booking ID:", booking.id || bookingId);
      console.log("Total amount:", totalAmountStr);

      if (booking.paymentType === "cash") {
        // Create hotel payment for cash payments - set type to booking_payment_cash
        const hotelPaymentData = {
          hotelId: booking.hotelId,
          bookingId: null,
          type: "booking_payment_cash",
          amount: totalAmountStr,
          dueDate: null,
          paid: null,
          paidAt: null,
        };

        console.log("=== HOTEL PAYMENT DATA ===");
        console.log("Final hotel payment data:", hotelPaymentData);

        const result = await createHotelPayment(hotelPaymentData);
        console.log("Hotel payment created successfully:", result);
        toast.success("Hotel payment record created successfully");
      } else if (booking.paymentType === "online") {
        // Create admin payment for online payments - set type to booking_payment_online
        const adminPaymentData = {
          hotelId: booking.hotelId,
          bookingId: null,
          type: "booking_payment_online",
          method: null,
          amount: totalAmountStr,
          settled: null,
          settledAt: null,
        };

        console.log("=== ADMIN PAYMENT DATA ===");
        console.log("Final admin payment data:", adminPaymentData);

        const result = await createAdminPayment(adminPaymentData);
        console.log("Admin payment created successfully:", result);
        toast.success("Admin payment record created successfully");
      }

      setPaymentConfirmed(true);
    } catch (error: any) {
      console.error("=== PAYMENT CONFIRMATION ERROR ===");
      console.error("Error details:", error);
      console.error("Error message:", error.message);

      // Better error message handling
      let displayMessage = "Payment confirmation failed";
      if (error && error.message && typeof error.message === "string") {
        displayMessage = error.message;
      } else if (error && typeof error === "string") {
        displayMessage = error;
      }

      toast.error(displayMessage);
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  // Helper function to format amount
  const formatAmount = (amount?: string | number) => {
    if (!amount) return "Not specified";
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return "Not specified";
    return `${numAmount.toFixed(2)} ${booking.currency || "USD"}`;
  };

  return (
    <Card className="max-w-8xl mx-auto max-h-[85vh] flex flex-col bg-white/80 backdrop-blur-sm">
      <div className="p-6 border-b flex-shrink-0">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center text-green-600">
            <BadgeCheck className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Booking Confirmed!
          </h2>
          <p className="text-gray-500">Booking ID: {bookingId}</p>
          {paymentConfirmed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
              <p className="text-green-800 font-medium">✓ Payment Confirmed</p>
              <p className="text-green-600 text-sm">
                {booking.paymentType === "cash"
                  ? "Hotel payment record created successfully"
                  : "Admin payment record created successfully"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-8 grid gap-8 grid-cols-1 md:grid-cols-2">
          {/* Left Column: Custom & Other Info */}
          <div className="flex flex-col gap-8">
            {/* Guest Information */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Guest Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900">
                  {booking.guestName || "Not specified"}
                </p>
                <p className="text-gray-500">
                  {booking.guestEmail || "Not specified"}
                </p>
                <p className="text-gray-500">
                  {booking.guestPhone || "Not specified"}
                </p>
              </div>
            </div>

            {/* Room Details */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Room Details</h3>
              <div className="grid gap-4">
                <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                  <Bed className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Rooms</p>
                    <p className="text-gray-500">
                      {booking.numRooms || 1} room(s)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Guests</p>
                    <p className="text-gray-500">
                      {booking.numAdults || 1} Adult(s)
                      {(booking.numChildren ?? 0) > 0 &&
                        `, ${booking.numChildren} Children`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Special Requests</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">{booking.specialRequests}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Booking & Payment Info */}
          <div className="flex flex-col gap-8">
            {/* Stay Details */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Stay Details</h3>
              <div className="grid gap-4">
                <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Check-in
                    </p>
                    <p className="text-gray-500">
                      {booking.checkInDate
                        ? format(new Date(booking.checkInDate), "MMM dd, yyyy")
                        : "N/A"}
                    </p>
                    {booking.checkInTime && (
                      <p className="text-gray-500">{booking.checkInTime}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Check-out
                    </p>
                    <p className="text-gray-500">
                      {booking.checkOutDate
                        ? format(new Date(booking.checkOutDate), "MMM dd, yyyy")
                        : "N/A"}
                    </p>
                    {booking.checkOutTime && (
                      <p className="text-gray-500">{booking.checkOutTime}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details & Button */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Payment Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col items-center gap-2 mb-6 p-3 bg-white rounded-md shadow-sm">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                  <span className="text-xl font-bold text-gray-900">
                    {formatAmount(booking.totalAmount)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.paymentType === "cash"
                        ? "bg-green-100 text-green-800"
                        : booking.paymentType === "online"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {booking.paymentType === "cash"
                      ? "Cash Payment"
                      : booking.paymentType === "online"
                        ? "Online Payment"
                        : "Payment Type Not Specified"}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Amount</span>
                    <span className="font-medium text-gray-900">
                      {formatAmount(booking.totalAmount)}
                    </span>
                  </div>
                  {booking.commissionAmount && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Commission</span>
                      <span className="font-medium text-gray-900">
                        {formatAmount(booking.commissionAmount)}
                      </span>
                    </div>
                  )}
                  {booking.netPayableToHotel && (
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-gray-500">
                        Net Payable to Hotel
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatAmount(booking.netPayableToHotel)}
                      </span>
                    </div>
                  )}

                  {/* Payment Method Details */}
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-gray-500">Payment Method</span>
                    <span className="font-medium text-gray-900">
                      {booking.paymentType === "online"
                        ? "Online Payment"
                        : booking.paymentType === "cash"
                          ? "Cash Payment"
                          : "Not Specified"}
                    </span>
                  </div>

                  {/* Show payment status if confirmed */}
                  {paymentConfirmed && (
                    <div className="flex justify-between bg-green-50 border border-green-200 rounded px-2 py-1 mt-2">
                      <span className="text-green-700 font-medium">
                        Payment Status
                      </span>
                      <span className="font-medium text-green-800">
                        {booking.paymentType === "online" ? "Settled" : "Paid"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Confirmation Button */}
              {!paymentConfirmed &&
                booking.paymentType &&
                booking.totalAmount && (
                  <div className="mt-6">
                    <button
                      onClick={handleConfirmPayment}
                      disabled={
                        isConfirmingPayment ||
                        !booking.paymentType ||
                        !booking.totalAmount ||
                        !booking.hotelId
                      }
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      <DollarSign className="w-5 h-5" />
                      {isConfirmingPayment
                        ? "Confirming Payment..."
                        : "Confirm Payment"}
                    </button>
                    {booking.paymentType && (
                      <p className="text-sm text-gray-600 text-center mt-2">
                        This will create a{" "}
                        <span className="font-medium">
                          {booking.paymentType === "cash"
                            ? "hotel payment"
                            : "admin payment"}
                        </span>{" "}
                        record for {booking.paymentType} payment
                      </p>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
