interface Booking {
  id: string;
  booking_date: Date;
  booking_time: string;
  shift: Shift;
  flat: string | number;
  floor: number;
}

type Shift = 'MORNING' | 'EVENING';

const bookings: Booking[] = [
  {
    id: '1',
    booking_date: new Date(),
    booking_time: '10:00',
    shift: 'MORNING',
    flat: 'A',
    floor: 1,
  },
  {
    id: '2',
    booking_date: new Date(2023, 9, 15),
    booking_time: '10:00',
    shift: 'EVENING',
    flat: 'A',
    floor: 2,
  },
  {
    id: '3',
    booking_date: new Date(2023, 9, 15),
    booking_time: '10:00',
    shift: 'MORNING',
    flat: 'A',
    floor: 3,
  },
  {
    id: '4',
    booking_date: new Date(2023, 9, 16),
    booking_time: '10:00',
    shift: 'EVENING',
    flat: 'A',
    floor: 4,
  },
  {
    id: '5',
    booking_date: new Date(2023, 9, 16),
    booking_time: '10:00',
    shift: 'MORNING',
    flat: 'A',
    floor: 5,
  },
  {
    id: '6',
    booking_date: new Date(2023, 9, 18),
    booking_time: '10:00',
    shift: 'EVENING',
    flat: 'A',
    floor: 6,
  },
  {
    id: '7',
    booking_date: new Date('2023-10-20T03:24:00'),
    booking_time: '10:00',
    shift: 'MORNING',
    flat: 'A',
    floor: 7,
  },
  {
    id: '8',
    booking_date: new Date('2023-10-26T03:24:00'),
    booking_time: '10:00',
    shift: 'EVENING',
    flat: 'A',
    floor: 8,
  },
];
export default bookings;
