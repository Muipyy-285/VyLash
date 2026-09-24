
import lashNatural from '../assets/eyelash_natural.png';
import lashCatEye from '../assets/eyelash_cateye_v2.png';
import lashDramatic from '../assets/eyelash_dramatic.png';

export const products = [
    {
        id: 1,
        name: "Natural Wispy",
        price: 159,
        style: "natural",
        image: lashNatural, // In a real app, this would be a product photo
        description: "Perfect for everyday wear. These magnetic lashes add subtle volume and length for a natural enhancement."
    },
    {
        id: 2,
        name: "Cat Eye Glam",
        price: 199,
        style: "cateye",
        image: lashCatEye,
        description: "Elongate your eyes with our signature Cat Eye style. Flared outer corners create a seductive, lifted look."
    },
    {
        id: 3,
        name: "Dramatic Volume",
        price: 259,
        style: "dramatic",
        image: lashDramatic,
        description: "Make a statement. These high-volume lashes provide maximum density and length for special occasions."
    }
];
