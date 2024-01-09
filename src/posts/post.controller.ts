import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "../auth/get-user.decorator";
import { User } from "../auth/user.entity";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post as PostEntity } from "./posts.entity";
import { PostsService } from "./posts.service";
import { Logger } from "@nestjs/common";

@Controller("posts")
@UseGuards(AuthGuard())
export class PostsController {
  private logger = new Logger("PostsController");

  constructor(private postService: PostsService) {}

  @Get()
  getPosts(@GetUser() user: User): Promise<PostEntity[]> {
    this.logger.verbose(`User "${user.name}" retrieving all Posts.)}`);
    return this.postService.getPosts();
  }

  @Get("/:id")
  getPostById(
    @Param("id") id: string,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    return this.postService.getPostById(id, user.id);
  }

  @Post()
  createPost(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    this.logger.verbose(
      `User "${user.name}" creating a new Post. Data: ${JSON.stringify(
        createPostDto,
      )}`,
    );
    return this.postService.createPost(createPostDto, user.id);
  }

  @Delete("/:id")
  deletePost(@Param("id") id: string, @GetUser() user: User): Promise<string> {
    return this.postService.deletePost(id, user.id);
  }

  @Patch("/:id")
  updatePostStatus(
    @Param("id") id: string,
    @Body() updatePostStatusDto: UpdatePostDto,
    @GetUser() user: User,
  ): Promise<PostEntity> {
    return this.postService.updatePostStatus(id, updatePostStatusDto, user.id);
  }
}
