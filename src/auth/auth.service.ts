import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { MESSAGES } from 'src/constants/message.constant';
import { SignUpDto } from './dtos/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  // 회원가입
  async signUp({
    nickName,
    email,
    password,
    passwordConfirm,
    //profileImage,
  }: SignUpDto) {
    // 기존 이메일로 가입된 이력이 있을 경우 False
    const existedEmail = await this.userRepository.findOneBy({ email });
    if (existedEmail)
      throw new BadRequestException(MESSAGES.AUTH.COMMON.DUPLICATED);

    // 비밀번호가 Null값일 때, False 반환
    if (!password)
      throw new BadRequestException(MESSAGES.AUTH.COMMON.PASSWORD.REQUIRED);

    // 비밀번호와 비밀번호 확인이랑 일치하는 지
    const isPasswordMatched = password === passwordConfirm;
    if (!isPasswordMatched) {
      throw new BadRequestException(
        MESSAGES.AUTH.COMMON.PASSWORD_CONFIRM.NOT_MATCHED_WITH_PASSWORD,
      );
    }

    const hashRounds = this.configService.get<number>('PASSWORD_HASH');
    const hashedPassword = bcrypt.hashSync(password, hashRounds);

    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
      nickName,
    });
    delete user.password;

    return user;
  }
}
