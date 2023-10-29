import {
  Entity,
  Property,
  PrimaryKey,
  SerializedPrimaryKey,
  DateTimeType,
  ManyToOne,
  type Rel,
} from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { User } from "./user.entity";

@Entity()
export class Booking {
  @PrimaryKey({ nullable: false, unique: true })
  _id?: ObjectId = new ObjectId();

  @SerializedPrimaryKey()
  id?: string;

  @Property({ nullable: false })
  shift!: string;

  @Property({ type: DateTimeType, nullable: false })
  booking_date!: Date;

  @Property({ type: DateTimeType, nullable: false })
  booking_created_at!: Date;
  @ManyToOne(() => User, { nullable: false })
  user!: Rel<User>;
}
