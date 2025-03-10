import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderItem } from './order-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderItemDto } from './dto/create-orderItem.dto';
import { UpdateOrderItemDto } from './dto/update-orderItem.dto';


@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    return this.orderItemRepository.save(createOrderItemDto);
  }

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemRepository.find({ relations: ['order'] });
  }

  async findOne(id: number): Promise<OrderItem> {
    const orderItems = await this.orderItemRepository.findOne({
      where: { id },
    });
    if (!orderItems) {
      throw new NotFoundException(`orderItems with ID ${id} not found`);
    }
    return orderItems;
  }

  async update(
    id: number,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    const orderItem = await this.findOne(id);
    const updatedOrderItem = { ...orderItem, ...updateOrderItemDto };
    return this.orderItemRepository.save(updatedOrderItem);
  }

  async remove(id: number): Promise<void> {
    const orderItem = await this.findOne(id);
    if (!orderItem) {
      throw new NotFoundException(`Categories with ID ${id} not found`);
    }
    await this.orderItemRepository.remove(orderItem);
  }

  async removeProductByOrderId(orderId: number, productId: number): Promise<void> {
    const orderItems = await this.orderItemRepository.findOne({
      where: { order:{ id: orderId }, product:{id: productId} },
    });
    if (!orderId) {
      throw new NotFoundException(`OrderItem with ID ${orderId} not found`);
    }
    if (!orderItems) {
      throw new NotFoundException(`OrderItem with order ID ${orderId} and product ID ${productId} not found`);
    }
    await this.orderItemRepository.delete(orderItems.id);
  }
}
