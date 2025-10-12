import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import RepositoryInterface from "../../domain/repository/repositoy-interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";


export default class OrderRepository implements RepositoryInterface<Order> {

  async create(entity: Order): Promise<void> {
    await OrderModel.create({
      id: entity.id,
      customer_id: entity.customerId,
      total: entity.total(),
      items: entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        product_id: item.productId,
      })),
    }, {
      include: [{ model: OrderItemModel }],
    });
  }

  async update(entity: Order): Promise<void> {
    await OrderItemModel.destroy({
      where: { order_id: entity.id },
    });
    const items = entity.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      product_id: item.productId,
      order_id: entity.id,
    }));
    await OrderItemModel.bulkCreate(items);
    await OrderModel.update({
      customer_id: entity.customerId,
      total: entity.total(),
    }, {
      where: { id: entity.id },
    });
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: ["items"],
      rejectOnEmpty: true,
    });

    const items = orderModel.items.map((item) => new OrderItem(
      item.id,
      item.name,
      item.price,
      item.product_id,
      item.quantity,
    ));
    return new Order(orderModel.id, orderModel.customer_id, items);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: ["items"],
    });

    return orderModels.map((orderModel) => {
      const items = orderModel.items.map((item) => new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity,
      ));
      return new Order(orderModel.id, orderModel.customer_id, items);
    });
  }
}
