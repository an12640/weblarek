import { IProduct } from "../../types";

export class ProductCatalog {
    products: IProduct[] = [];
    selectedProduct: IProduct | null = null;

    getProducts(): IProduct[] {
        return this.products;
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find((product) => product.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}
