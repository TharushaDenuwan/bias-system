// // "use client";

// // import { useCreateHotelPayment } from "@/features/hotel-payments/queries/use-create-hotel-payment";
// // import {
// //   paymentsHotelInsertSchema,
// //   type PaymentsHotelInsert,
// // } from "@/features/hotel-payments/schemas/hotel-payment.schema";
// // import { Button } from "@repo/ui/components/button";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardFooter,
// //   CardHeader,
// //   CardTitle,
// // } from "@repo/ui/components/card";
// // import { Input } from "@repo/ui/components/input";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@repo/ui/components/select";
// // import { useAppForm } from "@repo/ui/components/tanstack-form";
// // import { Calendar, CreditCard, DollarSign, FileText } from "lucide-react";
// // import { useRouter } from "next/navigation";
// // import { useCallback, useState } from "react";
// // import {getClient} from "@/lib/rpc/client";

// // interface CreateHotelPaymentProps {
// //   hotelId?: string;
// //   bookingId?: string;
// //   onSuccess?: () => void;
// // }

// // const defaultValues: Partial<PaymentsHotelInsert> = {
// //   hotelId: "",
// //   bookingId: "",
// //   type: "receive_commission_from_cash",
// //   amount: "",
// //   dueDate: "",
// //   paid: false,
// // };

// // export function CreateHotelPayment({
// //   hotelId,
// //   bookingId,
// //   onSuccess,
// // }: CreateHotelPaymentProps) {
// //   const router = useRouter();
// //   const { mutate, isPending } = useCreateHotelPayment();

// //   const [paymentType, setPaymentType] = useState<string>(
// //     "receive_commission_from_cash"
// //   );

// //   const form = useAppForm({
// //     validators: { onChange: paymentsHotelInsertSchema },
// //     defaultValues: {
// //       ...defaultValues,
// //       hotelId: hotelId || "",
// //       bookingId: bookingId || "",
// //       type: paymentType,
// //     },
// //     onSubmit: ({ value }) =>
// //       mutate(value as PaymentsHotelInsert, {
// //         onSuccess: () => {
// //           form.reset();
// //           onSuccess?.() || router.push("/admin/hotel-payments");
// //         },
// //       }),
// //   });

// //   const handleSubmit = useCallback(
// //     (e: React.FormEvent) => {
// //       e.preventDefault();
// //       e.stopPropagation();
// //       form.handleSubmit();
// //     },
// //     [form]
// //   );

// //   const getPaymentTypeDescription = (type: string) => {
// //     switch (type) {
// //       case "receive_commission_from_cash":
// //         return "Commission to be collected from hotel for cash bookings";
// //       case "repay_net_from_online":
// //         return "Net amount to be paid to hotel for online bookings";
// //       default:
// //         return "";
// //     }
// //   };

// //   return (
// //     <Card className="w-full max-w-2xl rounded-sm">
// //       <CardHeader>
// //         <CardTitle className="text-lg font-bold font-heading flex items-center gap-2">
// //           <CreditCard className="w-5 h-5" />
// //           Create Hotel Payment
// //         </CardTitle>
// //         <CardDescription>
// //           Create a payment record for hotel commission or payout
// //         </CardDescription>
// //       </CardHeader>

// //       <form.AppForm>
// //         <form onSubmit={handleSubmit}>
// //           <CardContent className="flex flex-col gap-y-5 mb-6">
// //             {/* Hotel ID */}
// //             <form.AppField
// //               name="hotelId"
// //               children={(field) => (
// //                 <field.FormItem>
// //                   <field.FormLabel className="flex items-center gap-2">
// //                     <FileText className="w-4 h-4" />
// //                     Hotel ID
// //                   </field.FormLabel>
// //                   <field.FormControl>
// //                     <Input
// //                       disabled={isPending || !!hotelId}
// //                       placeholder="Enter hotel ID"
// //                       value={field.state.value}
// //                       onChange={(e) => field.handleChange(e.target.value)}
// //                       onBlur={field.handleBlur}
// //                     />
// //                   </field.FormControl>
// //                   <field.FormMessage />
// //                 </field.FormItem>
// //               )}
// //             />
// //             {/* Booking ID */}
// //             <form.AppField
// //               name="bookingId"
// //               children={(field) => (
// //                 <field.FormItem>
// //                   <field.FormLabel className="flex items-center gap-2">
// //                     <FileText className="w-4 h-4" />
// //                     Booking ID
// //                   </field.FormLabel>
// //                   <field.FormControl>
// //                     <Input
// //                       disabled={isPending || !!bookingId}
// //                       placeholder="Enter booking ID"
// //                       value={field.state.value}
// //                       onChange={(e) => field.handleChange(e.target.value)}
// //                       onBlur={field.handleBlur}
// //                     />
// //                   </field.FormControl>
// //                   <field.FormMessage />
// //                 </field.FormItem>
// //               )}
// //             />
// //             {/* Payment Type */}
// //             <form.AppField
// //               name="type"
// //               children={(field) => (
// //                 <field.FormItem>
// //                   <field.FormLabel className="flex items-center gap-2">
// //                     <CreditCard className="w-4 h-4" />
// //                     Payment Type
// //                   </field.FormLabel>
// //                   <field.FormControl>
// //                     <Select
// //                       disabled={isPending}
// //                       value={field.state.value}
// //                       onValueChange={(value) => {
// //                         field.handleChange(value);
// //                         setPaymentType(value);
// //                       }}
// //                     >
// //                       <SelectTrigger>
// //                         <SelectValue placeholder="Select payment type" />
// //                       </SelectTrigger>
// //                       <SelectContent>
// //                         <SelectItem value="receive_commission_from_cash">
// //                           <div className="flex flex-col">
// //                             <span>Receive Commission (Cash)</span>
// //                             <span className="text-xs text-muted-foreground">
// //                               Collect commission from hotel
// //                             </span>
// //                           </div>
// //                         </SelectItem>
// //                         <SelectItem value="repay_net_from_online">
// //                           <div className="flex flex-col">
// //                             <span>Pay Net Amount (Online)</span>
// //                             <span className="text-xs text-muted-foreground">
// //                               Pay net amount to hotel
// //                             </span>
// //                           </div>
// //                         </SelectItem>
// //                       </SelectContent>
// //                     </Select>
// //                   </field.FormControl>
// //                   {field.state.value && (
// //                     <p className="text-sm text-muted-foreground">
// //                       {getPaymentTypeDescription(field.state.value)}
// //                     </p>
// //                   )}
// //                   <field.FormMessage />
// //                 </field.FormItem>
// //               )}
// //             />
// //             {/* Amount */}
// //             <form.AppField
// //               name="amount"
// //               children={(field) => (
// //                 <field.FormItem>
// //                   <field.FormLabel className="flex items-center gap-2">
// //                     <DollarSign className="w-4 h-4" />
// //                     Amount
// //                   </field.FormLabel>
// //                   <field.FormControl>
// //                     <Input
// //                       disabled={isPending}
// //                       type="number"
// //                       step="0.01"
// //                       placeholder="0.00"
// //                       value={field.state.value}
// //                       onChange={(e) => field.handleChange(e.target.value)}
// //                       onBlur={field.handleBlur}
// //                     />
// //                   </field.FormControl>
// //                   <field.FormMessage />
// //                 </field.FormItem>
// //               )}
// //             />
// //             {/* Due Date */}
// //             <form.AppField
// //               name="dueDate"
// //               children={(field) => (
// //                 <field.FormItem>
// //                   <field.FormLabel className="flex items-center gap-2">
// //                     <Calendar className="w-4 h-4" />
// //                     Due Date
// //                   </field.FormLabel>
// //                   <field.FormControl>
// //                     <Input
// //                       disabled={isPending}
// //                       type="date"
// //                       value={field.state.value || ""}
// //                       onChange={(e) => field.handleChange(e.target.value)}
// //                       onBlur={field.handleBlur}
// //                     />
// //                   </field.FormControl>
// //                   <field.FormMessage />
// //                 </field.FormItem>
// //               )}
// //             />
// //             {/* Payment Status Indicator */}
// //             <div className="p-4 bg-gray-50 rounded-lg">
// //               <div className="flex items-center gap-2 mb-2">
// //                 <div
// //                   className={`w-3 h-3 rounded-full ${
// //                     paymentType === "receive_commission_from_cash"
// //                       ? "bg-orange-500"
// //                       : "bg-green-500"
// //                   }`}
// //                 />
// //                 <span className="font-medium">
// //                   {paymentType === "receive_commission_from_cash"
// //                     ? "Commission Collection"
// //                     : "Hotel Payout"}
// //                 </span>
// //               </div>
// //               <p className="text-sm text-muted-foreground">
// //                 {getPaymentTypeDescription(paymentType)}
// //               </p>
// //             </div>
// //           </CardContent>

// //           <CardFooter className="flex gap-2">
// //             <Button
// //               type="button"
// //               variant="outline"
// //               onClick={() => router.back()}
// //               disabled={isPending}
// //             >
// //               Cancel
// //             </Button>
// //             <Button type="submit" loading={isPending} disabled={isPending}>
// //               Create Payment Record
// //             </Button>
// //           </CardFooter>
// //         </form>
// //       </form.AppForm>
// //     </Card>
// //   );
// // }

// "use client";

// import { useCreateHotelPayment } from "@/features/hotel-payments/queries/use-create-hotel-payment";
// import {
//   paymentsHotelInsertSchema,
//   type PaymentsHotelInsert,
// } from "@/features/hotel-payments/schemas/hotel-payment.schema";
// import { authClient } from "@/lib/auth-client";
// import { Button } from "@repo/ui/components/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@repo/ui/components/card";
// import { Input } from "@repo/ui/components/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@repo/ui/components/select";
// import { useAppForm } from "@repo/ui/components/tanstack-form";
// import {
//   Calendar,
//   CreditCard,
//   DollarSign,
//   FileText,
//   Loader2,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useCallback, useEffect, useState } from "react";

// interface CreateHotelPaymentProps {
//   hotelId?: string;
//   bookingId?: string;
//   onSuccess?: () => void;
// }

// const defaultValues: Partial<PaymentsHotelInsert> = {
//   hotelId: "",
//   bookingId: "",
//   type: "receive_commission_from_cash",
//   amount: "",
//   dueDate: "",
//   paid: false,
// };

// export function CreateHotelPayment({
//   hotelId: propHotelId,
//   bookingId,
//   onSuccess,
// }: CreateHotelPaymentProps) {
//   const router = useRouter();
//   const { data: session } = authClient.useSession();
//   const { mutate, isPending } = useCreateHotelPayment();

//   const [paymentType, setPaymentType] = useState<string>(
//     "receive_commission_from_cash"
//   );
//   const [fetchingHotelId, setFetchingHotelId] = useState(false);
//   const [userHotelId, setUserHotelId] = useState<string>("");

//   // Fetch hotel ID from user session
//   useEffect(() => {
//     const fetchUserHotelId = async () => {
//       if (!session?.user?.id || propHotelId) return;

//       setFetchingHotelId(true);
//       try {
//         // First try to get hotel ID from user profile
//         const userResponse = await fetch(
//           `/api/users/${session.user.id}/profile`
//         );
//         if (userResponse.ok) {
//           const userData = await userResponse.json();
//           const hotelId = userData.hotelId || userData.hotel_id;

//           if (hotelId) {
//             setUserHotelId(hotelId);
//             return;
//           }
//         }

//         // Fallback: Try to get hotel ID from hotels API
//         const hotelsResponse = await fetch(
//           `/api/hotels?userId=${session.user.id}`
//         );
//         if (hotelsResponse.ok) {
//           const hotelsData = await hotelsResponse.json();
//           if (hotelsData.data && hotelsData.data.length > 0) {
//             setUserHotelId(hotelsData.data[0].id);
//             return;
//           }
//         }

//         // Additional fallback: Try to get from user's organizations/hotels
//         const orgResponse = await fetch(
//           `/api/users/${session.user.id}/organizations`
//         );
//         if (orgResponse.ok) {
//           const orgData = await orgResponse.json();
//           if (orgData.data && orgData.data.length > 0) {
//             // Look for hotel-type organization
//             const hotelOrg = orgData.data.find(
//               (org: any) => org.type === "hotel"
//             );
//             if (hotelOrg) {
//               setUserHotelId(hotelOrg.id);
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching user hotel ID:", error);
//       } finally {
//         setFetchingHotelId(false);
//       }
//     };

//     fetchUserHotelId();
//   }, [session?.user?.id, propHotelId]);

//   const form = useAppForm({
//     validators: { onChange: paymentsHotelInsertSchema },
//     defaultValues: {
//       ...defaultValues,
//       hotelId: propHotelId || userHotelId || "",
//       bookingId: bookingId || "",
//       type: paymentType,
//     },
//     onSubmit: ({ value }) =>
//       mutate(value as PaymentsHotelInsert, {
//         onSuccess: () => {
//           form.reset();
//           onSuccess?.() || router.push("/account/manage/payment-details");
//         },
//       }),
//   });

//   // Update form when userHotelId is fetched
//   useEffect(() => {
//     if (userHotelId && !propHotelId) {
//       form.setFieldValue("hotelId", userHotelId);
//     }
//   }, [userHotelId, propHotelId, form]);

//   const handleSubmit = useCallback(
//     (e: React.FormEvent) => {
//       e.preventDefault();
//       e.stopPropagation();
//       form.handleSubmit();
//     },
//     [form]
//   );

//   const getPaymentTypeDescription = (type: string) => {
//     switch (type) {
//       case "receive_commission_from_cash":
//         return "Commission to be collected from hotel for cash bookings";
//       case "payout_to_hotel":
//         return "Net amount to be paid to hotel for online bookings";
//       case "refund":
//         return "Refund amount to be processed";
//       default:
//         return "";
//     }
//   };

//   const finalHotelId = propHotelId || userHotelId;
//   const isHotelIdDisabled = isPending || !!propHotelId || fetchingHotelId;

//   return (
//     <Card className="w-full max-w-2xl rounded-sm">
//       <CardHeader>
//         <CardTitle className="text-lg font-bold font-heading flex items-center gap-2">
//           <CreditCard className="w-5 h-5" />
//           Create Hotel Payment
//         </CardTitle>
//         <CardDescription>
//           Create a payment record for hotel commission or payout
//         </CardDescription>
//       </CardHeader>

//       <form.AppForm>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="flex flex-col gap-y-5 mb-6">
//             {/* Hotel ID */}
//             <form.AppField
//               name="hotelId"
//               children={(field) => (
//                 <field.FormItem>
//                   <field.FormLabel className="flex items-center gap-2">
//                     <FileText className="w-4 h-4" />
//                     Hotel ID
//                     {fetchingHotelId && (
//                       <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
//                     )}
//                   </field.FormLabel>
//                   <field.FormControl>
//                     <Input
//                       disabled={isHotelIdDisabled}
//                       placeholder={
//                         fetchingHotelId
//                           ? "Loading hotel ID..."
//                           : finalHotelId
//                             ? "Hotel ID auto-filled"
//                             : "Enter hotel ID"
//                       }
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       onBlur={field.handleBlur}
//                     />
//                   </field.FormControl>
//                   {finalHotelId && (
//                     <p className="text-xs text-green-600">
//                       ✓ Hotel ID automatically set from your account
//                     </p>
//                   )}
//                   {!finalHotelId && !fetchingHotelId && session?.user?.id && (
//                     <p className="text-xs text-orange-600">
//                       ⚠ No hotel ID found in your account. Please enter
//                       manually.
//                     </p>
//                   )}
//                   <field.FormMessage />
//                 </field.FormItem>
//               )}
//             />

//             {/* Booking ID */}
//             <form.AppField
//               name="bookingId"
//               children={(field) => (
//                 <field.FormItem>
//                   <field.FormLabel className="flex items-center gap-2">
//                     <FileText className="w-4 h-4" />
//                     Booking ID
//                   </field.FormLabel>
//                   <field.FormControl>
//                     <Input
//                       disabled={isPending || !!bookingId}
//                       placeholder="Enter booking ID"
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       onBlur={field.handleBlur}
//                     />
//                   </field.FormControl>
//                   <field.FormMessage />
//                 </field.FormItem>
//               )}
//             />

//             {/* Payment Type */}
//             <form.AppField
//               name="type"
//               children={(field) => (
//                 <field.FormItem>
//                   <field.FormLabel className="flex items-center gap-2">
//                     <CreditCard className="w-4 h-4" />
//                     Payment Type
//                   </field.FormLabel>
//                   <field.FormControl>
//                     <Select
//                       disabled={isPending}
//                       value={field.state.value}
//                       onValueChange={(value) => {
//                         field.handleChange(value);
//                         setPaymentType(value);
//                       }}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select payment type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="receive_commission_from_cash">
//                           <div className="flex flex-col">
//                             <span>Receive Commission (Cash)</span>
//                             <span className="text-xs text-muted-foreground">
//                               Collect commission from hotel
//                             </span>
//                           </div>
//                         </SelectItem>
//                         <SelectItem value="payout_to_hotel">
//                           <div className="flex flex-col">
//                             <span>Pay Net Amount (Online)</span>
//                             <span className="text-xs text-muted-foreground">
//                               Pay net amount to hotel
//                             </span>
//                           </div>
//                         </SelectItem>
//                         <SelectItem value="refund">
//                           <div className="flex flex-col">
//                             <span>Refund</span>
//                             <span className="text-xs text-muted-foreground">
//                               Process refund amount
//                             </span>
//                           </div>
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </field.FormControl>
//                   {field.state.value && (
//                     <p className="text-sm text-muted-foreground">
//                       {getPaymentTypeDescription(field.state.value)}
//                     </p>
//                   )}
//                   <field.FormMessage />
//                 </field.FormItem>
//               )}
//             />

//             {/* Amount */}
//             <form.AppField
//               name="amount"
//               children={(field) => (
//                 <field.FormItem>
//                   <field.FormLabel className="flex items-center gap-2">
//                     <DollarSign className="w-4 h-4" />
//                     Amount
//                   </field.FormLabel>
//                   <field.FormControl>
//                     <Input
//                       disabled={isPending}
//                       type="number"
//                       step="0.01"
//                       placeholder="0.00"
//                       value={field.state.value}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       onBlur={field.handleBlur}
//                     />
//                   </field.FormControl>
//                   <field.FormMessage />
//                 </field.FormItem>
//               )}
//             />

//             {/* Due Date */}
//             <form.AppField
//               name="dueDate"
//               children={(field) => (
//                 <field.FormItem>
//                   <field.FormLabel className="flex items-center gap-2">
//                     <Calendar className="w-4 h-4" />
//                     Due Date
//                   </field.FormLabel>
//                   <field.FormControl>
//                     <Input
//                       disabled={isPending}
//                       type="date"
//                       value={field.state.value || ""}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       onBlur={field.handleBlur}
//                     />
//                   </field.FormControl>
//                   <field.FormMessage />
//                 </field.FormItem>
//               )}
//             />

//             {/* Payment Status Indicator */}
//             <div className="p-4 bg-gray-50 rounded-lg">
//               <div className="flex items-center gap-2 mb-2">
//                 <div
//                   className={`w-3 h-3 rounded-full ${
//                     paymentType === "receive_commission_from_cash"
//                       ? "bg-orange-500"
//                       : paymentType === "payout_to_hotel"
//                         ? "bg-green-500"
//                         : "bg-blue-500"
//                   }`}
//                 />
//                 <span className="font-medium">
//                   {paymentType === "receive_commission_from_cash"
//                     ? "Commission Collection"
//                     : paymentType === "payout_to_hotel"
//                       ? "Hotel Payout"
//                       : "Refund Processing"}
//                 </span>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 {getPaymentTypeDescription(paymentType)}
//               </p>
//             </div>
//           </CardContent>

//           <CardFooter className="flex gap-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => router.back()}
//               disabled={isPending}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               loading={isPending || fetchingHotelId}
//               disabled={isPending || fetchingHotelId}
//             >
//               Create Payment Record
//             </Button>
//           </CardFooter>
//         </form>
//       </form.AppForm>
//     </Card>
//   );
// }

"use client";

import { useCreateHotelPayment } from "@/features/hotel-payments/queries/use-create-hotel-payment";
import {
  paymentsHotelInsertSchema,
  type PaymentsHotelInsert,
} from "@/features/hotel-payments/schemas/hotel-payment.schema";
import { authClient } from "@/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useAppForm } from "@repo/ui/components/tanstack-form";
import {
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface CreateHotelPaymentProps {
  hotelId?: string;
  onSuccess?: () => void;
}

const defaultValues: Partial<PaymentsHotelInsert> = {
  hotelId: "",
  bookingId: null, // Set to null since we're removing the field
  type: "payment_for_admin",
  amount: "",
  dueDate: "",
  paid: false,
};

export function CreateHotelPayment({
  hotelId: propHotelId,
  onSuccess,
}: CreateHotelPaymentProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { mutate, isPending } = useCreateHotelPayment();

  const [paymentType, setPaymentType] = useState<string>("payment_for_admin");
  const [fetchingHotelId, setFetchingHotelId] = useState(false);
  const [userHotelId, setUserHotelId] = useState<string>("");

  // Fetch hotel ID from user session
  useEffect(() => {
    const fetchUserHotelId = async () => {
      if (!session?.user?.id || propHotelId) return;

      setFetchingHotelId(true);
      try {
        // First try to get hotel ID from user profile
        const userResponse = await fetch(
          `/api/users/${session.user.id}/profile`
        );
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const hotelId = userData.hotelId || userData.hotel_id;

          if (hotelId) {
            setUserHotelId(hotelId);
            return;
          }
        }

        // Fallback: Try to get hotel ID from hotels API
        const hotelsResponse = await fetch(
          `/api/hotels?userId=${session.user.id}`
        );
        if (hotelsResponse.ok) {
          const hotelsData = await hotelsResponse.json();
          if (hotelsData.data && hotelsData.data.length > 0) {
            setUserHotelId(hotelsData.data[0].id);
            return;
          }
        }

        // Additional fallback: Try to get from user's organizations/hotels
        const orgResponse = await fetch(
          `/api/users/${session.user.id}/organizations`
        );
        if (orgResponse.ok) {
          const orgData = await orgResponse.json();
          if (orgData.data && orgData.data.length > 0) {
            // Look for hotel-type organization
            const hotelOrg = orgData.data.find(
              (org: any) => org.type === "hotel"
            );
            if (hotelOrg) {
              setUserHotelId(hotelOrg.id);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user hotel ID:", error);
      } finally {
        setFetchingHotelId(false);
      }
    };

    fetchUserHotelId();
  }, [session?.user?.id, propHotelId]);

  const form = useAppForm({
    validators: { onChange: paymentsHotelInsertSchema },
    defaultValues: {
      ...defaultValues,
      hotelId: propHotelId || userHotelId || "",
      type: paymentType,
    },
    onSubmit: ({ value }) =>
      mutate(value as PaymentsHotelInsert, {
        onSuccess: () => {
          form.reset();
          onSuccess?.() || router.push("/account/manage/payment-details");
        },
      }),
  });

  // Update form when userHotelId is fetched
  useEffect(() => {
    if (userHotelId && !propHotelId) {
      form.setFieldValue("hotelId", userHotelId);
    }
  }, [userHotelId, propHotelId, form]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const getPaymentTypeDescription = (type: string) => {
    switch (type) {
      case "payment_for_admin":
        return "Payment to be made to the admin";
      case "incoming":
        return "Payment to be received from the hotel";
      default:
        return "";
    }
  };

  const finalHotelId = propHotelId || userHotelId;
  const isHotelIdDisabled = isPending || !!propHotelId || fetchingHotelId;

  return (
    <Card className="w-full max-w-2xl rounded-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold font-heading flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Create Hotel Payment
        </CardTitle>
        <CardDescription>
          Create an payment_for_admin payment record for hotel payout
        </CardDescription>
      </CardHeader>

      <form.AppForm>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-y-5 mb-6">
            {/* Hotel ID */}
            <form.AppField
              name="hotelId"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Hotel ID
                    {fetchingHotelId && (
                      <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                    )}
                  </field.FormLabel>
                  <field.FormControl>
                    <Input
                      disabled={isHotelIdDisabled}
                      placeholder={
                        fetchingHotelId
                          ? "Loading hotel ID..."
                          : finalHotelId
                            ? "Hotel ID auto-filled"
                            : "Enter hotel ID"
                      }
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </field.FormControl>
                  {finalHotelId && (
                    <p className="text-xs text-green-600">
                      ✓ Hotel ID automatically set from your account
                    </p>
                  )}
                  {!finalHotelId && !fetchingHotelId && session?.user?.id && (
                    <p className="text-xs text-orange-600">
                      ⚠ No hotel ID found in your account. Please enter
                      manually.
                    </p>
                  )}
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            {/* Payment Type */}
            <form.AppField
              name="type"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Type
                  </field.FormLabel>
                  <field.FormControl>
                    <Select
                      disabled={isPending}
                      value={field.state.value}
                      onValueChange={(value) => {
                        field.handleChange(value);
                        setPaymentType(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payment_for_admin">
                          <div className="flex flex-col">
                            <span>Outgoing Payment</span>
                            <span className="text-xs text-muted-foreground">
                              Payment to be made to hotel
                            </span>
                          </div>
                        </SelectItem>
                        {/* <SelectItem value="incoming">
                          <div className="flex flex-col">
                            <span>Incoming Payment</span>
                            <span className="text-xs text-muted-foreground">
                              Payment to be received from hotel
                            </span>
                          </div>
                        </SelectItem> */}
                      </SelectContent>
                    </Select>
                  </field.FormControl>
                  {field.state.value && (
                    <p className="text-sm text-muted-foreground">
                      {getPaymentTypeDescription(field.state.value)}
                    </p>
                  )}
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            {/* Amount */}
            <form.AppField
              name="amount"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Amount
                  </field.FormLabel>
                  <field.FormControl>
                    <Input
                      disabled={isPending}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            {/* Due Date */}
            <form.AppField
              name="dueDate"
              children={(field) => (
                <field.FormItem>
                  <field.FormLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Due Date
                  </field.FormLabel>
                  <field.FormControl>
                    <Input
                      disabled={isPending}
                      type="date"
                      value={field.state.value || ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />

            {/* Payment Status Indicator */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    paymentType === "payment_for_admin"
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                />
                <span className="font-medium">
                  {paymentType === "payment_for_admin"
                    ? "Outgoing Payment"
                    : "Incoming Payment"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {getPaymentTypeDescription(paymentType)}
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isPending || fetchingHotelId}
              disabled={isPending || fetchingHotelId}
            >
              Create Payment Record
            </Button>
          </CardFooter>
        </form>
      </form.AppForm>
    </Card>
  );
}
