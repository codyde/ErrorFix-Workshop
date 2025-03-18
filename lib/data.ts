import { Product } from "@/types";
import { faker } from "@faker-js/faker";

const products: Product[] = [];

for (let i = 0; i < 3000; i++) {
  const product: Product = {
    id: `${i}`,
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseInt(faker.commerce.price({ min: 9.99, max: 9999.99 })),
    images: [faker.image.urlPicsumPhotos(), faker.image.urlPicsumPhotos()],
    category: faker.commerce.department(),
    sizes: faker.helpers.arrayElements([
      "Extra Small",
      "Small",
      "Medium",
      "Large",
      "Extra Large",
    ]),
    colors: faker.helpers.arrayElements([
      "Red",
      "Blue",
      "Green",
      "Yellow",
      "Black",
    ]),
    featured: faker.datatype.boolean(),
    inStock: true,
    rating: faker.number.float({ min: 1.5, max: 4.9 }),
    reviewCount: faker.number.int({ min: 9, max: 317 }),
  };
  products.push(product);
}

export { products };

