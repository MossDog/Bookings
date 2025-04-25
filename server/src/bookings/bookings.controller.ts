import { BookingsService } from './bookings.service';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './interfaces/booking.interface';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    console.log(
      `This action creates a booking for ${createBookingDto.customer} at ${createBookingDto.time} ${createBookingDto.date}`,
    );

    await Promise.resolve(this.bookingsService.create(createBookingDto));
  }

  @Get()
  async findAll(
    @Query('customer') customer: string,
    @Query('date') date: string,
    @Query('time') time: string,
  ): Promise<Booking[]> {
    console.log(
      `This action returns all bookings. Filters: ${customer}, ${date}, ${time}`,
    );

    return Promise.resolve(this.bookingsService.findAll());
  }

  @Get(':id')
  findOne(@Param() params: { id: string }): string {
    console.log(params.id);
    return `This action returns booking #${params.id}`;
  }
}
