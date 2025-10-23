import { Module } from "@nestjs/common";
import { DatabaseConnectionModule } from "../database.module";
import { EventsRepository } from "./repositories/events.repository";

@Module({
    imports: [DatabaseConnectionModule],
    providers: [EventsRepository],
    exports: [EventsRepository],
  })
  export class DatabaseEventsModule {}