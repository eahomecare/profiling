import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Event, Prisma } from '@prisma/client';

@Injectable()
export class EventService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(): Promise<Event[]> {
    return this.prisma.event.findMany();
  }

  async findOne(
    id: string,
  ): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: { id },
    });
  }

  async create(
    data: Prisma.EventCreateInput,
  ): Promise<Event> {
    try {
      data.start = new Date(data.start);
      data.end = new Date(data.end);
      const createdEvent =
        await this.prisma.event.create({
          data,
        });
      return createdEvent;
    } catch (error) {
      console.log(error);

      throw new Error('Failed to create event');
    }
  }
}
