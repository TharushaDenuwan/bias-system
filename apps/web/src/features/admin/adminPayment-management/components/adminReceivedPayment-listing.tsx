"use client";

import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  DollarSign,
  Eye,
  Filter,
  Search,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";

interface AdminPayment {
  id: string;
  hotelId: string;
  organizationId: string;
  type: string | null;
  method: string | null;
  amount: string;
  settled: boolean | null;
  settledAt: string | null;
  createdAt: string | null;
}

interface AdminPaymentsResponse {
  data: AdminPayment[];
  meta: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

interface Hotel {
  id: string;
  name: string;
  organizationId: string;
  city: string;
  state: string;
  status: string;
}

interface HotelsResponse {
  data: Hotel[];
  meta: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export default function AdminReceivedPaymentListing() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [meta, setMeta] = useState({
    currentPage: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentType, setPaymentType] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [settledStatus, setSettledStatus] = useState<string>("");
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [limit] = useState(10);

  // Fetch hotels for dropdown
  const fetchHotels = async () => {
    setHotelsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/hotels?limit=100&sort=asc`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch hotels: ${response.status}`);
      }

      const data: HotelsResponse = await response.json();
      setHotels(data.data);
    } catch (err) {
      console.error("Error fetching hotels:", err);
    } finally {
      setHotelsLoading(false);
    }
  };

  const fetchAdminPayments = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (currentPage) params.append("page", currentPage.toString());
      if (limit) params.append("limit", limit.toString());
      if (sortOrder) params.append("sort", sortOrder);
      if (searchQuery) params.append("search", searchQuery);
      if (paymentType) params.append("type", paymentType);
      if (paymentMethod) params.append("method", paymentMethod);
      if (settledStatus) params.append("settled", settledStatus);
      if (selectedHotelId) params.append("hotelId", selectedHotelId);

      const response = await fetch(
        `http://localhost:8000/api/payments-admin?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch payments: ${response.status}`);
      }

      const data: AdminPaymentsResponse = await response.json();
      setPayments(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    fetchAdminPayments();
  }, [
    currentPage,
    searchQuery,
    paymentType,
    paymentMethod,
    settledStatus,
    selectedHotelId,
    sortOrder,
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

  const getStatusBadge = (settled: boolean | null) => {
    if (settled === null) return "bg-gray-100 text-gray-800";
    return settled
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const getStatusText = (settled: boolean | null) => {
    if (settled === null) return "Unknown";
    return settled ? "Settled" : "Pending";
  };

  const getTypeBadge = (type: string | null) => {
    if (!type) return "bg-gray-100 text-gray-800";
    switch (type) {
      case "incoming":
        return "bg-green-100 text-green-800";
      case "outgoing":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatType = (type: string | null) => {
    if (!type) return "N/A";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatMethod = (method: string | null) => {
    if (!method) return "N/A";
    const methodMap: { [key: string]: string } = {
      stripe: "Stripe",
      bank_transfer: "Bank",
      paypal: "PayPal",
      cash: "Cash",
      check: "Check",
      wire_transfer: "Wire",
    };
    return methodMap[method] || method;
  };

  const getHotelName = (hotelId: string) => {
    const hotel = hotels.find((h) => h.id === hotelId);
    return hotel ? hotel.name : `Hotel ${hotelId.slice(0, 8)}...`;
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
          <p className="text-lg font-semibold">Error loading admin payments</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchAdminPayments}
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
              placeholder="Search admin payments..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Hotel Dropdown */}
            <select
              value={selectedHotelId}
              onChange={(e) => {
                setSelectedHotelId(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 min-w-[150px]"
              disabled={hotelsLoading}
            >
              <option value="">
                {hotelsLoading ? "Loading hotels..." : "All Hotels"}
              </option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name} - {hotel.city}, {hotel.state}
                </option>
              ))}
            </select>

            <select
              value={paymentType}
              onChange={(e) => {
                setPaymentType(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="incoming">Incoming</option>
              <option value="outgoing">Outgoing</option>
            </select>

            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Methods</option>
              <option value="stripe">Stripe</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="paypal">PayPal</option>
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="wire_transfer">Wire Transfer</option>
            </select>

            <select
              value={settledStatus}
              onChange={(e) => {
                setSettledStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Settled</option>
              <option value="false">Pending</option>
            </select>

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
            {meta.totalCount} admin payments
            {selectedHotelId && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                Filtered by: {getHotelName(selectedHotelId)}
              </span>
            )}
          </span>
          <button
            onClick={fetchAdminPayments}
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
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[18%]">
                  Hotel
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[12%]">
                  Type
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[12%]">
                  Method
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[14%]">
                  Amount
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[12%]">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[12%]">
                  Created
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[12%]">
                  Settled
                </th>
                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-[10%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <Settings className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">No admin payments found</p>
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
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                          <Settings className="w-3 h-3 text-blue-600" />
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
                      <div className="text-xs text-gray-900">
                        <div className="truncate font-medium">
                          {getHotelName(payment.hotelId)}
                        </div>
                        <div className="text-gray-500 truncate text-xs">
                          ID: {payment.hotelId.slice(0, 8)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getTypeBadge(
                          payment.type
                        )}`}
                      >
                        {formatType(payment.type)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center text-xs text-gray-900">
                        <CreditCard className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
                        <span className="truncate">
                          {formatMethod(payment.method)}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div
                        className={`text-xs font-semibold ${
                          payment.type === "incoming"
                            ? "text-green-600"
                            : payment.type === "outgoing"
                              ? "text-red-600"
                              : "text-gray-600"
                        }`}
                      >
                        <div className="truncate">
                          {payment.type === "incoming"
                            ? "+"
                            : payment.type === "outgoing"
                              ? "-"
                              : ""}
                          {formatCurrency(payment.amount)}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusBadge(
                          payment.settled
                        )}`}
                      >
                        {getStatusText(payment.settled)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-xs text-gray-500">
                        {formatDate(payment.createdAt)}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-xs text-gray-500">
                        {formatDate(payment.settledAt)}
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
                        {!payment.settled && (
                          <button
                            className="inline-flex items-center px-2 py-1 border border-green-300 rounded text-xs font-medium text-green-600 hover:bg-green-50"
                            onClick={() =>
                              console.log("Mark as settled:", payment.id)
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
