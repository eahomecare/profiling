import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EventService } from './event.service';
import { Event, Prisma } from '@prisma/client';

@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @Get()
    async getAllEvents(): Promise<Event[]> {
        return this.eventService.findAll();
    }

    @Get(':id')
    async getEventById(@Param('id') id: string): Promise<Event> {
        return this.eventService.findOne(id);
    }

    @Post()
    async createEvent(@Body() data: Prisma.EventCreateInput): Promise<Event> {
        return this.eventService.create(data);
    }
}
