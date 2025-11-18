import React from 'react';
import { MapPin, Star, Bed, Bath, Users, Wifi, Tv, Coffee, Wind, CheckCircle } from 'lucide-react';

const PropertyDetails = ({ property }) => {
    const amenityIcons = {
        'High-speed WiFi': Wifi,
        'Smart TV': Tv,
        'Coffee Machine': Coffee,
        'Air Conditioning': Wind,
        'Self Check-in': CheckCircle,
        'Workspace': CheckCircle,
        'Washer/Dryer': CheckCircle,
        'Fully Equipped Kitchen': Coffee,
        'Private Garden': CheckCircle,
        'Parking': CheckCircle,
        'Heating': Wind
    };

    return (
        <>
            <div className="min-h-screen bg-[#FFF9E9]">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                        {property.images.slice(0, 2).map((image, idx) => (
                            <img
                                key={idx}
                                src={image}
                                alt={`${property.name} - ${idx + 1}`}
                                className="w-full h-96 object-cover rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow"
                            />
                        ))}
                    </div>

                    <div className="flex flex-col lg:flex-row items-start justify-between gap-10 mb-16">
                        <div className="flex-1">
                            <h1 className="text-5xl font-bold text-[#284D4B] mb-4">{property.name}</h1>

                            <div className="flex flex-wrap items-center gap-6 text-gray-700 mb-6">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-6 h-6 text-[#284D4B]" />
                                    <span className="text-lg">{property.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                    <span className="text-lg font-bold">{property.rating}</span>
                                    <span className="text-gray-500">({property.totalReviews} reviews)</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-8 text-gray-700 mb-8">
                                <div className="flex items-center gap-3">
                                    <Bed className="w-6 h-6 text-[#284D4B]" />
                                    <span className="text-lg">{property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Bath className="w-6 h-6 text-[#284D4B]" />
                                    <span className="text-lg">{property.bathrooms} Bathroom{property.bathrooms > 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="w-6 h-6 text-[#284D4B]" />
                                    <span className="text-lg">{property.guests} Guests</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-[#284D4B]/10 min-w-[340px]">
                            <div className="text-4xl font-bold text-[#284D4B] mb-2">
                                £{property.price} <span className="text-xl font-normal text-gray-600">/night</span>
                            </div>
                            <button className="w-full mt-6 bg-[#284D4B] text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-[#1e3a3a] transition shadow-lg">
                                Book Now
                            </button>
                            <p className="text-center text-sm text-gray-600 mt-4">You won't be charged yet</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-screen bg-[#FFFDF6] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
                <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#284D4B] mb-6">
                        About this property
                    </h2>

                    <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-12 max-w-4xl">
                        {property.description}
                    </p>

                    <h3 className="text-2xl lg:text-3xl font-bold text-[#284D4B] mb-10">
                        What this place offers
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 pb-10">
                        {property.amenities.map((amenity, idx) => {
                            const Icon = amenityIcons[amenity] || CheckCircle;

                            return (
                                <button
                                    key={idx}
                                    className="group flex items-center gap-4 bg-white hover:bg-[#284D4B]/5 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-2 border-transparent hover:border-[#284D4B]/20 focus:outline-none focus:ring-4 focus:ring-[#284D4B]/20 text-left"
                                    aria-label={`Amenity: ${amenity}`}
                                >
                                    <div className="p-3 bg-[#284D4B]/10 rounded-xl group-hover:bg-[#284D4B]/20 group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                                        <Icon className="w-8 h-8 text-[#284D4B]" />
                                    </div>
                                    <span className="font-medium text-gray-800 text-base lg:text-lg group-hover:text-[#284D4B] transition-colors">
                                        {amenity}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PropertyDetails;