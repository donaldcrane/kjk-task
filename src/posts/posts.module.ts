import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PostsController } from "./post.controller";
import { DatabaseModule } from "../database/database.module";
import { PostsService } from "./posts.service";
import { postsProviders } from "./posts.repository";

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [PostsController],
  providers: [PostsService, ...postsProviders],
})
export class PostsModule {}
