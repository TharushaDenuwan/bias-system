import {
  FaBaby,
  FaBan,
  FaBath,
  FaBicycle,
  FaBreadSlice,
  FaBriefcase,
  FaBroom,
  FaBurn,
  FaCar,
  FaChair,
  FaChargingStation,
  FaChild,
  FaCity,
  FaClock,
  FaCocktail,
  FaCoffee,
  FaConciergeBell,
  FaCouch,
  FaCut,
  FaDice,
  FaDoorOpen,
  FaDumbbell,
  FaExchangeAlt,
  FaFire,
  FaGamepad,
  FaGift,
  FaGlassMartini,
  FaGlobe,
  FaGolfBall,
  FaHeart,
  FaHiking,
  FaHotel,
  FaHotTub,
  FaLeaf,
  FaLink,
  FaLock,
  FaMap,
  FaMoneyCheckAlt,
  FaMugHot,
  FaMusic,
  FaParking,
  FaPaw,
  FaShoppingCart,
  FaShuttleVan,
  FaSmoking,
  FaSnowflake,
  FaSortUp,
  FaSpa,
  FaStar,
  FaSuitcase,
  FaSun,
  FaSwimmingPool,
  FaTableTennis,
  FaTicketAlt,
  FaTree,
  FaTshirt,
  FaTv,
  FaUmbrellaBeach,
  FaUserLock,
  FaUsers,
  FaUtensils,
  FaVolumeMute,
  FaWater,
  FaWheelchair,
  FaWifi,
  FaWind
} from "react-icons/fa";
import { IconType } from "react-icons/lib";

export type AmenitiesListItem = {
  id: number;
  name: string;
  icon: IconType;
};

export const amenitiesList: AmenitiesListItem[] = [
  {
    id: 1,
    name: "Swimming Pool",
    icon: FaSwimmingPool
  },
  {
    id: 2,
    name: "WiFi",
    icon: FaWifi
  },
  {
    id: 3,
    name: "Snowflake",
    icon: FaSnowflake
  },
  {
    id: 4,
    name: "Fire",
    icon: FaFire
  },
  {
    id: 5,
    name: "Dumbbell",
    icon: FaDumbbell
  },
  {
    id: 6,
    name: "Spa",
    icon: FaSpa
  },
  {
    id: 7,
    name: "Utensils",
    icon: FaUtensils
  },
  {
    id: 8,
    name: "Cocktail",
    icon: FaCocktail
  },
  {
    id: 9,
    name: "Concierge",
    icon: FaConciergeBell
  },
  {
    id: 10,
    name: "Hotel",
    icon: FaHotel
  },
  {
    id: 11,
    name: "Parking",
    icon: FaParking
  },
  {
    id: 12,
    name: "Shuttle",
    icon: FaShuttleVan
  },
  {
    id: 13,
    name: "T-Shirt",
    icon: FaTshirt
  },
  {
    id: 14,
    name: "Briefcase",
    icon: FaBriefcase
  },
  {
    id: 15,
    name: "Users",
    icon: FaUsers
  },
  {
    id: 16,
    name: "Paw",
    icon: FaPaw
  },
  {
    id: 17,
    name: "Ban",
    icon: FaBan
  },
  {
    id: 18,
    name: "Smoking",
    icon: FaSmoking
  },
  {
    id: 19,
    name: "Coffee",
    icon: FaCoffee
  },
  {
    id: 20,
    name: "Bread",
    icon: FaBreadSlice
  },
  {
    id: 21,
    name: "Lock",
    icon: FaLock
  },
  {
    id: 22,
    name: "Martini",
    icon: FaGlassMartini
  },
  {
    id: 23,
    name: "Hot Mug",
    icon: FaMugHot
  },
  {
    id: 24,
    name: "Wind",
    icon: FaWind
  },
  {
    id: 25,
    name: "TV",
    icon: FaTv
  },
  {
    id: 26,
    name: "Door",
    icon: FaDoorOpen
  },
  {
    id: 27,
    name: "Water",
    icon: FaWater
  },
  {
    id: 28,
    name: "City",
    icon: FaCity
  },
  {
    id: 29,
    name: "Leaf",
    icon: FaLeaf
  },
  {
    id: 30,
    name: "Bath",
    icon: FaBath
  },
  {
    id: 31,
    name: "Hot Tub",
    icon: FaHotTub
  },
  {
    id: 32,
    name: "Car",
    icon: FaCar
  },
  {
    id: 33,
    name: "Charging Station",
    icon: FaChargingStation
  },
  {
    id: 34,
    name: "Bicycle",
    icon: FaBicycle
  },
  {
    id: 35,
    name: "Map",
    icon: FaMap
  },
  {
    id: 36,
    name: "Exchange",
    icon: FaExchangeAlt
  },
  {
    id: 37,
    name: "Money Check",
    icon: FaMoneyCheckAlt
  },
  {
    id: 38,
    name: "Suitcase",
    icon: FaSuitcase
  },
  {
    id: 39,
    name: "Sort Up",
    icon: FaSortUp
  },
  {
    id: 40,
    name: "Wheelchair",
    icon: FaWheelchair
  },
  {
    id: 41,
    name: "Link",
    icon: FaLink
  },
  {
    id: 42,
    name: "Child",
    icon: FaChild
  },
  {
    id: 43,
    name: "Baby",
    icon: FaBaby
  },
  {
    id: 44,
    name: "Gamepad",
    icon: FaGamepad
  },
  {
    id: 45,
    name: "Table Tennis",
    icon: FaTableTennis
  },
  {
    id: 46,
    name: "Golf Ball",
    icon: FaGolfBall
  },
  {
    id: 47,
    name: "Hiking",
    icon: FaHiking
  },
  {
    id: 48,
    name: "Umbrella Beach",
    icon: FaUmbrellaBeach
  },
  {
    id: 49,
    name: "Dice",
    icon: FaDice
  },
  {
    id: 50,
    name: "Music",
    icon: FaMusic
  },
  {
    id: 51,
    name: "Gift",
    icon: FaGift
  },
  {
    id: 52,
    name: "Cut",
    icon: FaCut
  },
  {
    id: 53,
    name: "Globe",
    icon: FaGlobe
  },
  {
    id: 54,
    name: "Broom",
    icon: FaBroom
  },
  {
    id: 55,
    name: "Clock",
    icon: FaClock
  },
  {
    id: 56,
    name: "User Lock",
    icon: FaUserLock
  },
  {
    id: 57,
    name: "Ticket",
    icon: FaTicketAlt
  },
  {
    id: 58,
    name: "Burn",
    icon: FaBurn
  },
  {
    id: 59,
    name: "Tree",
    icon: FaTree
  },
  {
    id: 60,
    name: "Chair",
    icon: FaChair
  },
  {
    id: 61,
    name: "Sun",
    icon: FaSun
  },
  {
    id: 62,
    name: "Couch",
    icon: FaCouch
  },
  {
    id: 63,
    name: "Shopping Cart",
    icon: FaShoppingCart
  },
  {
    id: 64,
    name: "Volume Mute",
    icon: FaVolumeMute
  },
  {
    id: 65,
    name: "Heart",
    icon: FaHeart
  },
  {
    id: 66,
    name: "Star",
    icon: FaStar
  }
];
