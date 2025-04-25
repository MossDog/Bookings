import { Injectable } from '@nestjs/common';
import { Booking } from './interfaces/booking.interface';

@Injectable()
export class BookingsService {
  private readonly bookings: Booking[] = [];

  create(booking: Booking) {
    this.bookings.push(booking);
  }

  findAll(): Booking[] {
    return this.bookings;
  }
}
