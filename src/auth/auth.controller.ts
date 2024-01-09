import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  AuthCredentialsDto,
  AuthLoginDto,
  IUser,
} from "./dto/auth-credentials.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<IUser> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post("/signin")
  signIn(
    @Body() authLoginDto: AuthLoginDto,
  ): Promise<{ data: IUser; token: string }> {
    return this.authService.signIn(authLoginDto);
  }
}
