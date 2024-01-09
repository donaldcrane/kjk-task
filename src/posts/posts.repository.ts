import { Post } from "./posts.entity";

export const postsProviders = [
  {
    provide: "POST_REPOSITORY",
    useValue: Post,
  },
];
