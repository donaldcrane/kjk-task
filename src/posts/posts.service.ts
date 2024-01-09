/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { Post } from "./posts.entity";
import { User } from "../auth/user.entity";
import { UpdatePostDto } from "./dto/update-post.dto";
import { DateTime } from "luxon";

@Injectable()
export class PostsService {
  constructor(
    @Inject("POST_REPOSITORY")
    private postsRepository: typeof Post,
  ) {}

  getPosts(): Promise<Post[]> {
    return this.postsRepository.findAll({
      include: [{ model: User, attributes: { exclude: ["password"] } }],
      raw: true,
    });
  }

  async getPostById(id: string, user: User): Promise<Post> {
    const found = await this.postsRepository.findOne({
      where: { id, author: user },
      include: [{ model: User, attributes: { exclude: ["password"] } }],
      raw: true,
    });

    if (!found) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    return found;
  }

  async createPost(CreatePostDto: CreatePostDto, user: number): Promise<Post> {
    const result = await this.postsRepository.create<Post>({
      ...CreatePostDto,
      creationDate: DateTime.now().toISO(),
      author: user,
    });
    return result.dataValues;
  }

  async deletePost(id: string, userId: number): Promise<string> {
    const result = await this.postsRepository.destroy({
      where: { id, author: userId },
    });

    if (!result) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return "post deleted";
  }

  async updatePostStatus(
    id: string,
    data: UpdatePostDto,
    userId: number,
  ): Promise<Post> {
    // Post.status = status;

    const [numberOfAffectedRows, [updatedPost]] =
      await this.postsRepository.update(
        { ...data },
        { where: { id, author: userId }, returning: true },
        // { raw: true },
      );

    return updatedPost.dataValues;
  }
}
