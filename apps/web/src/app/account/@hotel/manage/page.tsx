import { ManageHotelAmenities } from "@/features/hotels/components/dashboard-components/hotel-amenities";
import { ManageHotelImages } from "@/features/hotels/components/dashboard-components/hotel-images";
import { ManageHotelPolicies } from "@/features/hotels/components/dashboard-components/hotel-policies";
import { HotelUpdate } from "@/features/hotels/components/dashboard-components/hotel-update";

export default function ManageOwnedHotel() {
  return (
    <div className="space-y-3">
      <HotelUpdate />
      <ManageHotelImages />

      <ManageHotelAmenities />

      <ManageHotelPolicies />
    </div>
  );
}
