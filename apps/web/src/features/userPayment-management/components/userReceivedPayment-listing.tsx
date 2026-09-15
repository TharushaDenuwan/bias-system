// "use client";

// import {
//   ChevronLeft,
//   ChevronRight,
//   DollarSign,
//   Eye,
//   Filter,
//   Receipt,
//   Search,
// } from "lucide-react";
// import { useEffect, useState } from "react";

// interface UserReceivedPayment {
//   id: string;
//   hotelId: string;
//   bookingId: string;
//   organizationId: string;
//   type: string;
//   amount: string;
//   dueDate: string | null;
//   paid: boolean | null;
//   paidAt: string | null;
//   createdAt: string | null;
// }

// interface UserReceivedPaymentsResponse {
//   data: UserReceivedPayment[];
//   meta: {
//     currentPage: number;
//     limit: number;
//     totalCount: number;
//     totalPages: number;
//   };
// }

// export default function UserReceivedPaymentListing() {
//   const [payments, setPayments] = useState<UserReceivedPayment[]>([]);
//   const [meta, setMeta] = useState({
//     currentPage: 1,
//     limit: 10,
//     totalCount: 0,
//     totalPages: 1,
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Filter states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [paymentType, setPaymentType] = useState<string>("");
//   const [paidStatus, setPaidStatus] = useState<string>("");
//   const [hotelId, setHotelId] = useState<string>("");
//   const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
//   const [dueDateFrom, setDueDateFrom] = useState<string>("");
//   const [dueDateTo, setDueDateTo] = useState<string>("");
//   const [dateFrom, setDateFrom] = useState<string>("");
//   const [dateTo, setDateTo] = useState<string>("");
//   const [limit] = useState(10);

//   const fetchUserReceivedPayments = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const params = new URLSearchParams();
//       if (currentPage) params.append("page", currentPage.toString());
//       if (limit) params.append("limit", limit.toString());
//       if (sortOrder) params.append("sort", sortOrder);
//       if (searchQuery) params.append("search", searchQuery);
//       if (hotelId) params.append("hotelId", hotelId);
//       if (paymentType) params.append("type", paymentType);
//       if (paidStatus) params.append("paid", paidStatus);
//       if (dueDateFrom) params.append("dueDateFrom", dueDateFrom);
//       if (dueDateTo) params.append("dateTo", dueDateTo);
//       if (dateFrom) params.append("dateFrom", dateFrom);
//       if (dateTo) params.append("dateTo", dateTo);

//       const response = await fetch(
//         `http://localhost:8000/api/payments-hotel?${params.toString()}`
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch payments: ${response.status}`);
//       }

//       const data: UserReceivedPaymentsResponse = await response.json();
//       setPayments(data.data);
//       setMeta(data.meta);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserReceivedPayments();
//   }, [
//     currentPage,
//     searchQuery,
//     paymentType,
//     paidStatus,
//     hotelId,
//     sortOrder,
//     dueDateFrom,
//     dueDateTo,
//     dateFrom,
//     dateTo,
//   ]);

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const formatCurrency = (amount: string) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//     }).format(parseFloat(amount));
//   };

//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "2-digit",
//     });
//   };

//   const getStatusBadge = (paid: boolean | null) => {
//     if (paid === null) return "bg-gray-100 text-gray-800";
//     return paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
//   };

//   const getStatusText = (paid: boolean | null) => {
//     if (paid === null) return "Unknown";
//     return paid ? "Paid" : "Pending";
//   };

//   const getTypeBadge = (type: string) => {
//     switch (type) {
//       case "receive_commission_from_cash":
//         return "bg-blue-100 text-blue-800";
//       case "payout_to_hotel":
//         return "bg-purple-100 text-purple-800";
//       case "refund":
//         return "bg-orange-100 text-orange-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const formatType = (type: string) => {
//     const typeMap: { [key: string]: string } = {
//       receive_commission_from_cash: "Commission",
//       payout_to_hotel: "Payout",
//       refund: "Refund",
//     };
//     return typeMap[type] || type;
//   };

//   if (loading) {
//     return (
//       <div className="h-full flex flex-col">
//         <div className="animate-pulse space-y-4">
//           <div className="h-12 bg-gray-200 rounded"></div>
//           <div className="h-96 bg-gray-100 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="h-full flex items-center justify-center">
//         <div className="text-center text-red-600">
//           <p className="text-lg font-semibold">Error loading user payments</p>
//           <p className="text-sm">{error}</p>
//           <button
//             onClick={fetchUserReceivedPayments}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full flex flex-col overflow-hidden">
//       {/* Fixed Header Section */}
//       <div className="flex-shrink-0 space-y-4">
//         {/* Search and Filter Bar */}
//         <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search user payments..."
//               value={searchQuery}
//               onChange={(e) => handleSearch(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div className="flex flex-wrap gap-2">
//             <select
//               value={paymentType}
//               onChange={(e) => {
//                 setPaymentType(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Types</option>
//               <option value="receive_commission_from_cash">Commission</option>
//               <option value="payout_to_hotel">Payout</option>
//               <option value="refund">Refund</option>
//             </select>

//             <select
//               value={paidStatus}
//               onChange={(e) => {
//                 setPaidStatus(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Status</option>
//               <option value="true">Paid</option>
//               <option value="false">Pending</option>
//             </select>

//             <input
//               type="text"
//               placeholder="Hotel ID"
//               value={hotelId}
//               onChange={(e) => {
//                 setHotelId(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 w-24"
//             />

//             <select
//               value={sortOrder}
//               onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
//               className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="desc">Newest</option>
//               <option value="asc">Oldest</option>
//             </select>
//           </div>
//         </div>

//         {/* Results Summary */}
//         <div className="flex justify-between items-center text-sm text-gray-600">
//           <span>
//             Showing {(meta.currentPage - 1) * meta.limit + 1} to{" "}
//             {Math.min(meta.currentPage * meta.limit, meta.totalCount)} of{" "}
//             {meta.totalCount} payments
//           </span>
//           <button
//             onClick={fetchUserReceivedPayments}
//             className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
//           >
//             <Filter className="w-4 h-4" />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Scrollable Table Container */}
//       <div className="flex-1 border border-gray-200 rounded-lg bg-white overflow-hidden">
//         <div
//           className="h-full overflow-x-auto"
//           style={{
//             scrollbarWidth: "thin",
//             scrollbarColor: "#CBD5E0 #F7FAFC",
//           }}
//         >
//           <table className="w-full table-auto divide-y divide-gray-200">
//             <thead className="bg-gray-50 sticky top-0 z-10">
//               <tr>
//                 <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[18%]">
//                   Payment ID
//                 </th>
//                 <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[16%]">
//                   Hotel/Booking
//                 </th>
//                 <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[12%]">
//                   Type
//                 </th>
//                 <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[12%]">
//                   Amount
//                 </th>
//                 <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[10%]">
//                   Status
//                 </th>
//                 <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[11%]">
//                   Due Date
//                 </th>
//                 <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[11%]">
//                   Created
//                 </th>
//                 <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[11%]">
//                   Paid At
//                 </th>
//                 <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[9%]">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {payments.length === 0 ? (
//                 <tr>
//                   <td colSpan={9} className="px-6 py-12 text-center">
//                     <Receipt className="mx-auto w-12 h-12 text-gray-400 mb-4" />
//                     <p className="text-gray-600">No user payments found</p>
//                     <p className="text-sm text-gray-400">
//                       Try adjusting your search or filters
//                     </p>
//                   </td>
//                 </tr>
//               ) : (
//                 payments.map((payment) => (
//                   <tr key={payment.id} className="hover:bg-gray-50">
//                     <td className="px-3 py-3">
//                       <div className="flex items-center">
//                         <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
//                           <Receipt className="w-3 h-3 text-green-600" />
//                         </div>
//                         <div className="min-w-0 flex-1">
//                           <div className="text-xs font-medium text-gray-900 truncate">
//                             #{payment.id.slice(0, 8)}...
//                           </div>
//                           <div className="text-xs text-gray-500 font-mono truncate">
//                             {payment.organizationId.slice(0, 8)}...
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="text-xs text-gray-900">
//                         <div className="truncate">
//                           H: {payment.hotelId.slice(0, 8)}...
//                         </div>
//                         <div className="text-gray-500 truncate">
//                           B: {payment.bookingId.slice(0, 8)}...
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">
//                       <span
//                         className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getTypeBadge(payment.type)}`}
//                       >
//                         {formatType(payment.type)}
//                       </span>
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="text-xs font-semibold text-green-600">
//                         <div className="truncate">
//                           {formatCurrency(payment.amount)}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">
//                       <span
//                         className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusBadge(payment.paid)}`}
//                       >
//                         {getStatusText(payment.paid)}
//                       </span>
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="text-xs text-gray-500">
//                         {formatDate(payment.dueDate)}
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="text-xs text-gray-500">
//                         {formatDate(payment.createdAt)}
//                       </div>
//                     </td>
//                     <td className="px-3 py-3">
//                       <div className="text-xs text-gray-500">
//                         {formatDate(payment.paidAt)}
//                       </div>
//                     </td>
//                     <td className="px-3 py-3 text-right">
//                       <div className="flex items-center justify-end gap-1">
//                         <button
//                           className="inline-flex items-center px-2 py-1 border border-blue-300 rounded text-xs font-medium text-blue-600 hover:bg-blue-50"
//                           onClick={() =>
//                             console.log("View details:", payment.id)
//                           }
//                         >
//                           <Eye className="w-3 h-3" />
//                         </button>
//                         {!payment.paid && (
//                           <button
//                             className="inline-flex items-center px-2 py-1 border border-green-300 rounded text-xs font-medium text-green-600 hover:bg-green-50"
//                             onClick={() =>
//                               console.log("Mark as paid:", payment.id)
//                             }
//                           >
//                             <DollarSign className="w-3 h-3" />
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Fixed Footer Section */}
//       {meta.totalPages > 1 && (
//         <div className="flex-shrink-0 mt-4">
//           <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
//             <button
//               onClick={() => handlePageChange(meta.currentPage - 1)}
//               disabled={meta.currentPage <= 1}
//               className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//             >
//               <ChevronLeft className="w-4 h-4" />
//               Previous
//             </button>

//             <div className="flex items-center gap-2">
//               <span className="text-sm text-gray-600">
//                 Page {meta.currentPage} of {meta.totalPages}
//               </span>
//             </div>

//             <button
//               onClick={() => handlePageChange(meta.currentPage + 1)}
//               disabled={meta.currentPage >= meta.totalPages}
//               className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//             >
//               Next
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Eye,
  Filter,
  Receipt,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";

interface UserReceivedPayment {
  id: string;
  hotelId: string;
  bookingId: string | null; // Make it nullable
  organizationId: string;
  type: string;
  amount: string;
  dueDate: string | null;
  paid: boolean | null;
  paidAt: string | null;
  createdAt: string | null;
}

interface UserReceivedPaymentsResponse {
  data: UserReceivedPayment[];
  meta: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export default function UserReceivedPaymentListing() {
  const [payments, setPayments] = useState<UserReceivedPayment[]>([]);
  const [meta, setMeta] = useState({
    currentPage: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentType, setPaymentType] = useState<string>("");
  const [paidStatus, setPaidStatus] = useState<string>("");
  const [hotelId, setHotelId] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [dueDateFrom, setDueDateFrom] = useState<string>("");
  const [dueDateTo, setDueDateTo] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [limit] = useState(10);

  const fetchUserReceivedPayments = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (currentPage) params.append("page", currentPage.toString());
      if (limit) params.append("limit", limit.toString());
      if (sortOrder) params.append("sort", sortOrder);
      if (searchQuery) params.append("search", searchQuery);
      if (hotelId) params.append("hotelId", hotelId);
      if (paymentType) params.append("type", paymentType);
      if (paidStatus) params.append("paid", paidStatus);
      if (dueDateFrom) params.append("dueDateFrom", dueDateFrom);
      if (dueDateTo) params.append("dateTo", dueDateTo);
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);

      const response = await fetch(
        `http://localhost:8000/api/payments-hotel?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch payments: ${response.status}`);
      }

      const data: UserReceivedPaymentsResponse = await response.json();
      setPayments(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReceivedPayments();
  }, [
    currentPage,
    searchQuery,
    paymentType,
    paidStatus,
    hotelId,
    sortOrder,
    dueDateFrom,
    dueDateTo,
    dateFrom,
    dateTo,
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
  };

  const getStatusBadge = (paid: boolean | null) => {
    if (paid === null) return "bg-gray-100 text-gray-800";
    return paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getStatusText = (paid: boolean | null) => {
    if (paid === null) return "Unknown";
    return paid ? "Paid" : "Pending";
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "outgoing":
        return "bg-red-100 text-red-800";
      case "incoming":
        return "bg-green-100 text-green-800";
      case "refund":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      outgoing: "Outgoing",
      incoming: "Incoming",
      refund: "Refund",
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error loading user payments</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchUserReceivedPayments}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-4">
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search user payments..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={paymentType}
              onChange={(e) => {
                setPaymentType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="outgoing">Outgoing</option>
              <option value="incoming">Incoming</option>
              <option value="refund">Refund</option>
            </select>

            <select
              value={paidStatus}
              onChange={(e) => {
                setPaidStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Paid</option>
              <option value="false">Pending</option>
            </select>

            <input
              type="text"
              placeholder="Hotel ID"
              value={hotelId}
              onChange={(e) => {
                setHotelId(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 w-24"
            />

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            Showing {(meta.currentPage - 1) * meta.limit + 1} to{" "}
            {Math.min(meta.currentPage * meta.limit, meta.totalCount)} of{" "}
            {meta.totalCount} payments
          </span>
          <button
            onClick={fetchUserReceivedPayments}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Filter className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Scrollable Table Container */}
      <div className="flex-1 border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div
          className="h-full overflow-x-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E0 #F7FAFC",
          }}
        >
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[20%]">
                  Payment ID
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[15%]">
                  Hotel ID
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[12%]">
                  Type
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[12%]">
                  Amount
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[10%]">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[11%]">
                  Due Date
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[11%]">
                  Created
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[10%]">
                  Paid At
                </th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[9%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <Receipt className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">No user payments found</p>
                    <p className="text-sm text-gray-400">
                      Try adjusting your search or filters
                    </p>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                          <Receipt className="w-3 h-3 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium text-gray-900 truncate">
                            #{payment.id.slice(0, 8)}...
                          </div>
                          <div className="text-xs text-gray-500 font-mono truncate">
                            {payment.organizationId.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-xs text-gray-900 truncate">
                        {payment.hotelId.slice(0, 12)}...
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getTypeBadge(payment.type)}`}
                      >
                        {formatType(payment.type)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div
                        className={`text-xs font-semibold ${payment.type === "outgoing" ? "text-red-600" : "text-red-600"}`}
                      >
                        <div className="truncate">
                          {payment.type === "outgoing" ? "-" : "-"}
                          {formatCurrency(payment.amount)}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusBadge(payment.paid)}`}
                      >
                        {getStatusText(payment.paid)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-xs text-gray-500">
                        {formatDate(payment.dueDate)}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-xs text-gray-500">
                        {formatDate(payment.createdAt)}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-xs text-gray-500">
                        {formatDate(payment.paidAt)}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="inline-flex items-center px-2 py-1 border border-blue-300 rounded text-xs font-medium text-blue-600 hover:bg-blue-50"
                          onClick={() =>
                            console.log("View details:", payment.id)
                          }
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        {!payment.paid && (
                          <button
                            className="inline-flex items-center px-2 py-1 border border-green-300 rounded text-xs font-medium text-green-600 hover:bg-green-50"
                            onClick={() =>
                              console.log("Mark as paid:", payment.id)
                            }
                          >
                            <DollarSign className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fixed Footer Section */}
      {meta.totalPages > 1 && (
        <div className="flex-shrink-0 mt-4">
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
            <button
              onClick={() => handlePageChange(meta.currentPage - 1)}
              disabled={meta.currentPage <= 1}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Page {meta.currentPage} of {meta.totalPages}
              </span>
            </div>

            <button
              onClick={() => handlePageChange(meta.currentPage + 1)}
              disabled={meta.currentPage >= meta.totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
