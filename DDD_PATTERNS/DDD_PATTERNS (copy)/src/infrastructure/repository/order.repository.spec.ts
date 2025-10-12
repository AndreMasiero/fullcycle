import { Sequelize } from "sequelize-typescript";
import CustomerRepository from "./customer.repository";
import CustomerModel from "../db/sequelize/model/customer.model";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });


  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("123", "Product 1", 10);
    const product2 = new Product("456", "Product 2", 5);
    await productRepository.create(product1);
    await productRepository.create(product2);

    const item1 = new OrderItem("1", product1.name, product1.price, product1.id, 2);
    const order = new Order("123", customer.id, [item1]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const item1Updated = new OrderItem("1", product1.name, product1.price, product1.id, 3);
    const item2 = new OrderItem("2", product2.name, product2.price, product2.id, 1);
    const updatedOrder = new Order(order.id, customer.id, [item1Updated, item2]);

    await orderRepository.update(updatedOrder);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel).not.toBeNull();

    const json = orderModel!.toJSON() as any;
    json.items.sort((a: any, b: any) => a.id.localeCompare(b.id));

    expect(json).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: updatedOrder.total(),
      items: [
        {
          id: "1",
          name: product1.name,
          price: product1.price,
          quantity: 3,
          order_id: "123",
          product_id: "123",
        },
        {
          id: "2",
          name: product2.name,
          price: product2.price,
          quantity: 1,
          order_id: "123",
          product_id: "456",
        },
      ],
    });
  });

  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const foundOrder = await orderRepository.find(order.id);

    expect(foundOrder).toStrictEqual(order);
  });

  it ("should findAll orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer1 = new Customer("123", "Customer 1");
    customer1.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
    await customerRepository.create(customer1);

    const customer2 = new Customer("456", "Customer 2");
    customer2.changeAddress(new Address("Street 2", 2, "Zipcode 2", "City 2"));
    await customerRepository.create(customer2);

    const productRepository = new ProductRepository();
    const product1 = new Product("123", "Product 1", 10);
    const product2 = new Product("456", "Product 2", 5);
    await productRepository.create(product1);
    await productRepository.create(product2);

    const orderItem1 = new OrderItem(
      "1",
      product1.name,
      product1.price,
      product1.id,
      2
    );
    const order1 = new Order("123", customer1.id, [orderItem1]);
    const orderItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      3
    );
    const order2 = new Order("456", customer2.id, [orderItem2]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order1);
    expect(orders).toContainEqual(order2);
  });
});
