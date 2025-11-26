type RestaurantResponse ={
    name: string;
    openingHours: string;
    menu: MenuItemResponse[]
}

type MenuItemResponse = {
    id: number;
    name: string;
    description: string;
    price: string;
    allergens: string[];
    imageUrl?: string;
}
