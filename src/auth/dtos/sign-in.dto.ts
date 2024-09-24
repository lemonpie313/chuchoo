import { PickType } from '@nestjs/swagger';
import { Users } from 'src/users/entities/users.entity';

export class SignInDto extends PickType(Users, ['email', 'password']) {}
