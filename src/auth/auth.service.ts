import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  AuthCredentialsDto,
  AuthLoginDto,
  IUser,
} from "./dto/auth-credentials.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { User } from "../auth/user.entity";

@Injectable()
export class AuthService {
  constructor(
    @Inject("USER_REPOSITORY")
    private usersRepository: typeof User,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<IUser> {
    // return this.usersRepository.createUser(authCredentialsDto);
    const { email, password } = authCredentialsDto;

    const userExist = await this.usersRepository.findOne({ where: { email } });

    if (userExist) {
      throw new ConflictException("Details already exist");
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.usersRepository.create({
      ...authCredentialsDto,
      password: hashedPassword,
    });

    if (!user) {
      throw new InternalServerErrorException();
    }
    const { id, name } = user;
    return { id, name, email };
  }

  async signIn(
    authCredentialsDto: AuthLoginDto,
  ): Promise<{ data: IUser; token: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException("Please check your login credentials");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException("Please check your login credentials");
    }
    const data = { id: user.id, name: user.name, email: user.email };
    const payload: JwtPayload = data;
    const token: string = await this.jwtService.sign(payload);
    return { data, token };
  }
}
