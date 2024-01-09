import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PostsModule } from "./posts/posts.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostsModule,
    AuthModule,
    DatabaseModule,
    DatabaseModule,
  ],
})
export class AppModule {}
