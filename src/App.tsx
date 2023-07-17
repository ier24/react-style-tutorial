import { useState } from "react";

type Product = {
  category: string;
  price: string;
  stocked: boolean;
  name: string;
};

type ProductCategoryRowProps = {
  category: string;
};

type ProductRowProps = {
  product: Product;
};

type ProductTableProps = {
  products: Product[];
  filterText: string;
  inStockOnly: boolean;
};

type FilterableProductTableProps = {
  products: Product[];
};

function ProductCategoryRow({ category }: ProductCategoryRowProps) {
  return (
    <tr>
      <th colSpan={2}>{category}</th>
    </tr>
  );
}

function ProductRow({ product }: ProductRowProps) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: "red" }}>{product.name}: 品切れです!!</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({
  products,
  filterText,
  inStockOnly,
}: ProductTableProps) {
  const rows: JSX.Element[] = [];
  let lastCategory: string | null = null;

  products.forEach((product) => {
    if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />
      );
    }
    rows.push(<ProductRow product={product} key={product.name} />);
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange,
}: {
  filterText: string;
  inStockOnly: boolean;
  onFilterTextChange: (filterText: string) => void;
  onInStockOnlyChange: (inStockOnly: boolean) => void;
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."
        /**
         * 子→親へとデータを流す
         */
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onFilterTextChange(e.target.value)
        }
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onInStockOnlyChange(e.target.checked)
          }
        />{" "}
        在庫がある商品のみ表示する
      </label>
    </form>
  );
}

function FilterableProductTable({ products }: FilterableProductTableProps) {
  /**
   * SearchBar と ProductTableの共通の親で、検索テキストやチェックボックスの値に基づきフィルタリングされた商品リストをレンダリングする
   */
  const [filterText, setFilterText] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  );
}

const PRODUCTS: Product[] = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
