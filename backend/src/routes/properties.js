import express from 'express';

const router = express.Router();

const properties = [
    {
        id: "2b-n1-a-29-shoreditch-heights",
        name: "2B N1 A - 29 Shoreditch Heights",
        location: "Shoreditch, London",
        address: "29 Shoreditch High Street, London E1 6JN",
        price: 175,
        bedrooms: 2,
        bathrooms: 2,
        guests: 4,
        rating: 9.2,
        totalReviews: 24,
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
        ],
        description: "Modern and stylish 2-bedroom apartment in the heart of Shoreditch. Perfect for business travelers or leisure stays. Featuring contemporary design, high-speed WiFi, and all modern amenities. Located minutes from Old Street station with easy access to the City and West End.",
        amenities: [
            "High-speed WiFi",
            "Smart TV",
            "Coffee Machine",
            "Air Conditioning",
            "Self Check-in",
            "Workspace",
            "Washer/Dryer",
            "Fully Equipped Kitchen"
        ],
        checkInTime: "15:00",
        checkOutTime: "11:00",
        minimumStay: 2
    },
    {
        id: "1b-w2-c-westminster-tower",
        name: "1B W2 C - Westminster Tower",
        location: "Westminster, London",
        address: "Westminster Bridge Road, London SE1 7PB",
        price: 145,
        bedrooms: 1,
        bathrooms: 1,
        guests: 2,
        rating: 8.9,
        totalReviews: 18,
        images: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
        ],
        description: "Elegant one-bedroom apartment near Westminster with stunning views. Ideal for couples or solo travelers. Walking distance to major attractions including Big Ben, London Eye, and Westminster Abbey.",
        amenities: [
            "High-speed WiFi",
            "Smart TV",
            "Coffee Machine",
            "Heating",
            "Self Check-in",
            "Workspace"
        ],
        checkInTime: "15:00",
        checkOutTime: "11:00",
        minimumStay: 1
    },
    {
        id: "studio-ec1-b-angel-loft",
        name: "Studio EC1 B - Angel Loft",
        location: "Angel, London",
        address: "Islington High Street, London N1 9LQ",
        price: 95,
        bedrooms: 0,
        bathrooms: 1,
        guests: 2,
        rating: 9.5,
        totalReviews: 31,
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
        ],
        description: "Cozy studio in vibrant Angel. Perfect for budget-conscious travelers who don't want to compromise on location or quality. Close to trendy restaurants, bars, and shops.",
        amenities: [
            "High-speed WiFi",
            "Smart TV",
            "Coffee Machine",
            "Self Check-in",
            "Workspace"
        ],
        checkInTime: "15:00",
        checkOutTime: "11:00",
        minimumStay: 1
    },
    {
        id: "3b-sw1-a-chelsea-garden-flat",
        name: "3B SW1 A - Chelsea Garden Flat",
        location: "Chelsea, London",
        address: "Kings Road, London SW3 5UE",
        price: 245,
        bedrooms: 3,
        bathrooms: 2,
        guests: 6,
        rating: 8.7,
        totalReviews: 15,
        images: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
        ],
        description: "Spacious three-bedroom garden flat in exclusive Chelsea. Perfect for families or groups. Features private garden, multiple living spaces, and luxurious finishes throughout.",
        amenities: [
            "High-speed WiFi",
            "Smart TV",
            "Coffee Machine",
            "Air Conditioning",
            "Self Check-in",
            "Workspace",
            "Washer/Dryer",
            "Fully Equipped Kitchen",
            "Private Garden",
            "Parking"
        ],
        checkInTime: "15:00",
        checkOutTime: "11:00",
        minimumStay: 3
    }
];

router.get('/', (req, res) => {
    try {
        res.json({
            status: 'success',
            count: properties.length,
            data: properties
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const property = properties.find(p => p.id === id);

        if (!property) {
            return res.status(404).json({
                status: 'error',
                message: 'Property not found'
            });
        }

        res.json({
            status: 'success',
            data: property
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/:id/availability', (req, res) => {
    try {
        const { id } = req.params;
        const { checkIn, checkOut } = req.query;

        const property = properties.find(p => p.id === id);

        if (!property) {
            return res.status(404).json({
                status: 'error',
                message: 'Property not found'
            });
        }
        res.json({
            status: 'success',
            data: {
                propertyId: id,
                available: true,
                checkIn: checkIn || new Date().toISOString(),
                checkOut: checkOut || new Date(Date.now() + 86400000).toISOString(),
                totalPrice: property.price * 3
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;