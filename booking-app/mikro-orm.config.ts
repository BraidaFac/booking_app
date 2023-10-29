import { MikroORM, type Options } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { Booking } from "./src/data/entities/booking.entity";
import { User } from "./src/data/entities/user.entity";

export default {
  entities: [Booking, User],
  dbName: "clusteredificio",
  type: "mongo",
  clientUrl:
    "mongodb+srv://edificio3defebrero:ASD123ZXC@clusteredificio.a8jpvnu.mongodb.net/?retryWrites=true&w=majority",
  highlighter: new MongoHighlighter(),
  debug: true,
  schemaGenerator: {
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
};
