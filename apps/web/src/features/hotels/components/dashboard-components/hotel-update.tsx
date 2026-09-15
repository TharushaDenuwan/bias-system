// "use client";

// import { Button } from "@repo/ui/components/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@repo/ui/components/card";
// import { Input } from "@repo/ui/components/input";
// import { Textarea } from "@repo/ui/components/textarea";
// import { useEffect, useState } from "react";
// import { useGetHotelTypes } from "../../queries/use-get-hotel-types";
// import { useGetPropertyClasses } from "../../queries/use-get-property-classes";
// import {
//   UpdateHotelPayload,
//   useGetMyHotel,
//   useUpdateHotelByID,
// } from "../../queries/use-update-hotel-by-id";

// type OptionalHotelPayload = Partial<UpdateHotelPayload> & { name: string };

// export function HotelUpdate() {
//   const { data: myHotel, isLoading } = useGetMyHotel();
//   const { mutate, isPending } = useUpdateHotelByID();
//   const { data: hotelTypes, isLoading: isHotelTypesLoading } =
//     useGetHotelTypes();
//   const { data: propertyClasses, isLoading: isPropertyClassesLoading } =
//     useGetPropertyClasses();

//   const [form, setForm] = useState<OptionalHotelPayload>({
//     name: "",
//     description: undefined,
//     brandName: undefined,
//     street: undefined,
//     city: undefined,
//     state: undefined,
//     country: undefined,
//     postalCode: undefined,
//     latitude: undefined,
//     longitude: undefined,
//     phone: undefined,
//     email: undefined,
//     website: undefined,
//     hotelType: undefined,
//     starRating: undefined,
//     propertyClass: undefined,
//     checkInTime: undefined,
//     checkOutTime: undefined,
//     status: undefined,
//   });

//   useEffect(() => {
//     if (myHotel) {
//       setForm({
//         name: myHotel.name ?? "",
//         description: myHotel.description ?? undefined,
//         brandName: myHotel.brandName ?? undefined,
//         street: myHotel.street ?? undefined,
//         city: myHotel.city ?? undefined,
//         state: myHotel.state ?? undefined,
//         country: myHotel.country ?? undefined,
//         postalCode: myHotel.postalCode ?? undefined,
//         latitude:
//           myHotel.latitude !== undefined && myHotel.latitude !== null
//             ? Number(myHotel.latitude)
//             : undefined,
//         longitude:
//           myHotel.longitude !== undefined && myHotel.longitude !== null
//             ? Number(myHotel.longitude)
//             : undefined,
//         phone: myHotel.phone ?? undefined,
//         email: myHotel.email ?? undefined,
//         website: myHotel.website ?? undefined,
//         hotelType: myHotel.hotelType?.id ?? undefined,
//         starRating: myHotel.starRating ?? undefined,
//         propertyClass: myHotel.propertyClass?.id ?? undefined,
//         checkInTime: myHotel.checkInTime ?? undefined,
//         checkOutTime: myHotel.checkOutTime ?? undefined,
//         status: myHotel.status ?? undefined,
//       });
//     }
//   }, [myHotel]);

//   const handleChange = (field: keyof OptionalHotelPayload, value: any) => {
//     setForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleHotelTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     handleChange("hotelType", e.target.value || undefined);
//   };

//   const handlePropertyClassChange = (
//     e: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     handleChange("propertyClass", e.target.value || undefined);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (myHotel?.id && form.name.trim()) {
//       mutate({ id: myHotel.id, data: form });
//     }
//   };

//   if (isLoading || isHotelTypesLoading || isPropertyClassesLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!myHotel) {
//     return <div>No hotel found for this user.</div>;
//   }

//   return (
//     <Card className="p-3 pt-5 rounded-sm shadow-none max-w-6xl mx-auto">
//       <CardHeader>
//         <CardTitle className="text-xl">Update Hotel</CardTitle>
//       </CardHeader>
//       <form onSubmit={handleSubmit}>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Left Side */}
//             <div className="space-y-4">
//               <div>
//                 <label>Name *</label>
//                 <Input
//                   value={form.name}
//                   onChange={(e) => handleChange("name", e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <label>Description</label>
//                 <Textarea
//                   value={form.description ?? ""}
//                   onChange={(e) => handleChange("description", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label>Brand Name</label>
//                 <Input
//                   value={form.brandName ?? ""}
//                   onChange={(e) => handleChange("brandName", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label>Street</label>
//                 <Input
//                   value={form.street ?? ""}
//                   onChange={(e) => handleChange("street", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label>City</label>
//                 <Input
//                   value={form.city ?? ""}
//                   onChange={(e) => handleChange("city", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label>State</label>
//                 <Input
//                   value={form.state ?? ""}
//                   onChange={(e) => handleChange("state", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label>Country</label>
//                 <Input
//                   value={form.country ?? ""}
//                   onChange={(e) => handleChange("country", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label>Postal Code</label>
//                 <Input
//                   value={form.postalCode ?? ""}
//                   onChange={(e) => handleChange("postalCode", e.target.value)}
//                 />
//               </div>
//             </div>
//             {/* Right Side */}
//             <div className="space-y-4">
//               <div>
//                 <label>Latitude</label>
//                 <Input
//                   type="number"
//                   value={form.latitude ?? ""}
//                   onChange={(e) =>
//                     handleChange(
//                       "latitude",
//                       e.target.value === "" ? undefined : Number(e.target.value)
//                     )
//                   }
//                 />
//               </div>
//               <div>
//                 <label>Longitude</label>
//                 <Input
//                   type="number"
//                   value={form.longitude ?? ""}
//                   onChange={(e) =>
//                     handleChange(
//                       "longitude",
//                       e.target.value === "" ? undefined : Number(e.target.value)
//                     )
//                   }
//                 />
//               </div>
//               <div>
//                 <label>Phone</label>
//                 <Input
//                   value={form.phone ?? ""}
//                   onChange={(e) => handleChange("phone", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label>Email</label>
//                 <Input
//                   value={form.email ?? ""}
//                   onChange={(e) => handleChange("email", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label>Website</label>
//                 <Input
//                   value={form.website ?? ""}
//                   onChange={(e) => handleChange("website", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label>Hotel Type</label>
//                 <select
//                   className="w-full border rounded px-2 py-1"
//                   value={form.hotelType ?? ""}
//                   onChange={handleHotelTypeChange}
//                 >
//                   <option value="">Select Hotel Type</option>
//                   {hotelTypes?.map((type: { id: string; name: string }) => (
//                     <option key={type.id} value={type.id}>
//                       {type.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label>Star Rating</label>
//                 <Input
//                   type="number"
//                   value={form.starRating ?? ""}
//                   onChange={(e) =>
//                     handleChange(
//                       "starRating",
//                       e.target.value === "" ? undefined : Number(e.target.value)
//                     )
//                   }
//                 />
//               </div>
//               <div>
//                 <label>Property Class</label>
//                 <select
//                   className="w-full border rounded px-2 py-1"
//                   value={form.propertyClass ?? ""}
//                   onChange={handlePropertyClassChange}
//                 >
//                   <option value="">Select Property Class</option>
//                   {propertyClasses?.map((pc: { id: string; name: string }) => (
//                     <option key={pc.id} value={pc.id}>
//                       {pc.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label>Check In Time</label>
//                 <Input
//                   value={form.checkInTime ?? ""}
//                   onChange={(e) => handleChange("checkInTime", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label>Check Out Time</label>
//                 <Input
//                   value={form.checkOutTime ?? ""}
//                   onChange={(e) => handleChange("checkOutTime", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label>Status</label>
//                 <select
//                   className="w-full border rounded px-2 py-1"
//                   value={form.status ?? ""}
//                   onChange={(e) => handleChange("status", e.target.value)}
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                   <option value="under_maintenance">Under Maintenance</option>
//                   <option value="pending_approval">Pending Approval</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button type="submit" loading={isPending} disabled={isPending}>
//             Update Hotel
//           </Button>
//         </CardFooter>
//       </form>
//     </Card>
//   );
// }

"use client";

import { Button } from "@repo/ui/components/button";
import {
  Building2,
  CheckCircle,
  Clock,
  Globe,
  Mail,
  MapPin,
  Phone,
  Star,
  Tag,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useGetHotelTypes } from "../../queries/use-get-hotel-types";
import { useGetPropertyClasses } from "../../queries/use-get-property-classes";
import {
  UpdateHotelPayload,
  useGetMyHotel,
  useUpdateHotelByID,
} from "../../queries/use-update-hotel-by-id";

type OptionalHotelPayload = Partial<UpdateHotelPayload> & { name: string };

// Move InputField component outside of the main component to prevent re-creation
const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  icon: Icon,
  placeholder = "",
}) => (
  <div className="group">
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-indigo-500" />}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value || ""}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white group-hover:border-indigo-300"
    />
  </div>
);

// Move SelectField component outside as well
const SelectField = ({ label, value, onChange, children, icon: Icon }) => (
  <div className="group">
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-indigo-500" />}
      {label}
    </label>
    <select
      value={value || ""}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white group-hover:border-indigo-300"
    >
      {children}
    </select>
  </div>
);

// Move TextareaField component outside as well
const TextareaField = ({
  label,
  value,
  onChange,
  icon: Icon,
  placeholder = "",
}) => (
  <div className="group">
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-indigo-500" />}
      {label}
    </label>
    <textarea
      value={value || ""}
      onChange={onChange}
      rows={4}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white group-hover:border-indigo-300 resize-none"
    />
  </div>
);

export function HotelUpdate() {
  // Your original hooks exactly as they are
  const { data: myHotel, isLoading } = useGetMyHotel();
  const { mutate, isPending } = useUpdateHotelByID();
  const { data: hotelTypes, isLoading: isHotelTypesLoading } =
    useGetHotelTypes();
  const { data: propertyClasses, isLoading: isPropertyClassesLoading } =
    useGetPropertyClasses();

  const [form, setForm] = useState<OptionalHotelPayload>({
    name: "",
    description: undefined,
    brandName: undefined,
    street: undefined,
    city: undefined,
    state: undefined,
    country: undefined,
    postalCode: undefined,
    latitude: undefined,
    longitude: undefined,
    phone: undefined,
    email: undefined,
    website: undefined,
    hotelType: undefined,
    starRating: undefined,
    propertyClass: undefined,
    checkInTime: undefined,
    checkOutTime: undefined,
    status: undefined,
  });

  const [activeSection, setActiveSection] = useState("basic");

  // Your original useEffect exactly as it is
  useEffect(() => {
    if (myHotel) {
      setForm({
        name: myHotel.name ?? "",
        description: myHotel.description ?? undefined,
        brandName: myHotel.brandName ?? undefined,
        street: myHotel.street ?? undefined,
        city: myHotel.city ?? undefined,
        state: myHotel.state ?? undefined,
        country: myHotel.country ?? undefined,
        postalCode: myHotel.postalCode ?? undefined,
        latitude:
          myHotel.latitude !== undefined && myHotel.latitude !== null
            ? Number(myHotel.latitude)
            : undefined,
        longitude:
          myHotel.longitude !== undefined && myHotel.longitude !== null
            ? Number(myHotel.longitude)
            : undefined,
        phone: myHotel.phone ?? undefined,
        email: myHotel.email ?? undefined,
        website: myHotel.website ?? undefined,
        hotelType: myHotel.hotelType?.id ?? undefined,
        starRating: myHotel.starRating ?? undefined,
        propertyClass: myHotel.propertyClass?.id ?? undefined,
        checkInTime: myHotel.checkInTime ?? undefined,
        checkOutTime: myHotel.checkOutTime ?? undefined,
        status: myHotel.status ?? undefined,
      });
    }
  }, [myHotel]);

  // Use useCallback to memoize the handleChange function
  const handleChange = useCallback(
    (field: keyof OptionalHotelPayload, value: any) => {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  // Memoize the event handlers to prevent re-creation
  const handleHotelTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      handleChange("hotelType", e.target.value || undefined);
    },
    [handleChange]
  );

  const handlePropertyClassChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      handleChange("propertyClass", e.target.value || undefined);
    },
    [handleChange]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (myHotel?.id && form.name.trim()) {
        mutate({ id: myHotel.id, data: form });
      }
    },
    [myHotel?.id, form, mutate]
  );

  // Your original loading and error states
  if (isLoading || isHotelTypesLoading || isPropertyClassesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!myHotel) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No hotel found for this user.</p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: "basic", label: "Basic Info", icon: Building2 },
    { id: "location", label: "Location", icon: MapPin },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "details", label: "Details", icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Update Hotel
          </h1>
          <p className="text-gray-600">
            Manage your property information with ease
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-2xl p-1 shadow-lg border border-gray-100">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeSection === section.id
                      ? "bg-indigo-500 text-white shadow-md"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form with proper form tag */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          {activeSection === "basic" && (
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Building2 className="w-6 h-6 text-indigo-500" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <InputField
                    key="name"
                    label="Name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    icon={Building2}
                    placeholder="Enter hotel name"
                  />
                  <InputField
                    key="brandName"
                    label="Brand Name"
                    value={form.brandName ?? ""}
                    onChange={(e) => handleChange("brandName", e.target.value)}
                    icon={Tag}
                    placeholder="Enter brand name"
                  />
                </div>
                <div className="space-y-6">
                  <TextareaField
                    key="description"
                    label="Description"
                    value={form.description ?? ""}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder="Describe your hotel..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Location Section */}
          {activeSection === "location" && (
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-indigo-500" />
                Location Details
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <InputField
                    key="street"
                    label="Street"
                    value={form.street ?? ""}
                    onChange={(e) => handleChange("street", e.target.value)}
                    icon={MapPin}
                    placeholder="Enter street address"
                  />
                  <InputField
                    key="city"
                    label="City"
                    value={form.city ?? ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Enter city"
                  />
                  <InputField
                    key="state"
                    label="State"
                    value={form.state ?? ""}
                    onChange={(e) => handleChange("state", e.target.value)}
                    placeholder="Enter state"
                  />
                  <InputField
                    key="country"
                    label="Country"
                    value={form.country ?? ""}
                    onChange={(e) => handleChange("country", e.target.value)}
                    placeholder="Enter country"
                  />
                </div>
                <div className="space-y-6">
                  <InputField
                    key="postalCode"
                    label="Postal Code"
                    value={form.postalCode ?? ""}
                    onChange={(e) => handleChange("postalCode", e.target.value)}
                    placeholder="Enter postal code"
                  />
                  <InputField
                    key="latitude"
                    label="Latitude"
                    value={form.latitude ?? ""}
                    onChange={(e) =>
                      handleChange(
                        "latitude",
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                    type="number"
                    placeholder="Enter latitude"
                  />
                  <InputField
                    key="longitude"
                    label="Longitude"
                    value={form.longitude ?? ""}
                    onChange={(e) =>
                      handleChange(
                        "longitude",
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                    type="number"
                    placeholder="Enter longitude"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact Section */}
          {activeSection === "contact" && (
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Phone className="w-6 h-6 text-indigo-500" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <InputField
                    key="phone"
                    label="Phone"
                    value={form.phone ?? ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    icon={Phone}
                    placeholder="Enter phone number"
                  />
                  <InputField
                    key="email"
                    label="Email"
                    value={form.email ?? ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    icon={Mail}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-6">
                  <InputField
                    key="website"
                    label="Website"
                    value={form.website ?? ""}
                    onChange={(e) => handleChange("website", e.target.value)}
                    icon={Globe}
                    placeholder="Enter website URL"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Details Section */}
          {activeSection === "details" && (
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Tag className="w-6 h-6 text-indigo-500" />
                Hotel Details
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <SelectField
                    key="hotelType"
                    label="Hotel Type"
                    value={form.hotelType ?? ""}
                    onChange={handleHotelTypeChange}
                    icon={Building2}
                  >
                    <option value="">Select Hotel Type</option>
                    {hotelTypes?.map((type: { id: string; name: string }) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </SelectField>

                  <InputField
                    key="starRating"
                    label="Star Rating"
                    value={form.starRating ?? ""}
                    onChange={(e) =>
                      handleChange(
                        "starRating",
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                    type="number"
                    icon={Star}
                    placeholder="Enter star rating"
                  />

                  <SelectField
                    key="propertyClass"
                    label="Property Class"
                    value={form.propertyClass ?? ""}
                    onChange={handlePropertyClassChange}
                  >
                    <option value="">Select Property Class</option>
                    {propertyClasses?.map(
                      (pc: { id: string; name: string }) => (
                        <option key={pc.id} value={pc.id}>
                          {pc.name}
                        </option>
                      )
                    )}
                  </SelectField>
                </div>
                <div className="space-y-6">
                  <InputField
                    key="checkInTime"
                    label="Check In Time"
                    value={form.checkInTime ?? ""}
                    onChange={(e) =>
                      handleChange("checkInTime", e.target.value)
                    }
                    icon={Clock}
                    placeholder="Enter check-in time"
                  />

                  <InputField
                    key="checkOutTime"
                    label="Check Out Time"
                    value={form.checkOutTime ?? ""}
                    onChange={(e) =>
                      handleChange("checkOutTime", e.target.value)
                    }
                    icon={Clock}
                    placeholder="Enter check-out time"
                  />

                  <SelectField
                    key="status"
                    label="Status"
                    value={form.status ?? ""}
                    onChange={(e) => handleChange("status", e.target.value)}
                    icon={CheckCircle}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="under_maintenance">Under Maintenance</option>
                    <option value="pending_approval">Pending Approval</option>
                  </SelectField>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              loading={isPending}
              disabled={isPending}
              className="relative px-12 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5" />
                Update Hotel
              </div>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
