export interface SingleProduct {
  metadata: object;
  sys: {
    space: object;
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    environment: object;
    revision: number;
    contentType: object;
    locale: string;
  };
  fields: {
    sku: string;
    name: string;
    brand: string;
    model: string;
    category: string;
    color: string;
    price: number;
    currency: string;
    stock: number;
  };
}
