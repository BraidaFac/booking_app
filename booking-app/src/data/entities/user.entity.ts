import {
  Entity,
  Property,
  Collection,
  OneToMany,
  Cascade,
  PrimaryKey,
  SerializedPrimaryKey,
} from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { Booking } from "./booking.entity";
@Entity()
export class User {
  @PrimaryKey({ nullable: false, unique: true })
  _id?: ObjectId = new ObjectId();

  @SerializedPrimaryKey()
  id?: string;

  @Property({ nullable: false })
  password!: string;

  @OneToMany(() => Booking, (booking) => booking.user, {
    cascade: [Cascade.ALL],
  })
  bookings = new Collection<Booking>(this);
}
