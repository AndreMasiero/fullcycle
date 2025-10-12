import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {

  it("should throw error when id is empty", () => {
    expect(() => {
      let order_item = new Order("", "123", []);
    }).toThrow("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order_item = new Order("321", "", []);
    }).toThrow("CustomerId is required");
  });

  it("should throw error when item is empty", () => {
    expect(() => {
      let order_item = new Order("321", "123", []);
    }).toThrow("Items are required");
  });

  it("should calculate total", () => {
   
    const item1 = new OrderItem("1", "Item 1", 100, "p1", 2);
    const item2 = new OrderItem("2", "Item 2", 200, "p2", 2);

    const order = new Order("123", "123", [item1, item2]);
    const total = order.total();

    expect(total).toBe(600);

  });

  it("should check if the item qte is lass or equal 0", () => {
   
    expect(() => {
      const item1 = new OrderItem("1", "Item 1", 100, "p1", 0);
      const order = new Order("123", "123", [item1]);
    }).toThrow("Quantity must be greater than 0");
   
  });

});