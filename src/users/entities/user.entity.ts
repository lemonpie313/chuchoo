import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Validate,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
//   import { UserRole } from '../types/user-role.type';
//   import { CommunityUser } from '../../community/community-user/entities/communityUser.entity';
//   import { MembershipPayment } from '../../membership/entities/membership-payment.entity';
//   import { Cart } from 'src/cart/entities/cart.entity';
//   import { Order } from 'src/order/entities/order.entity';
//   import { UserProvider } from '../types/user-provider.type';
//   import { Refreshtoken } from 'src/auth/entities/refresh-token.entity';
//   import { Exclude } from 'class-transformer';
import { MESSAGES } from 'src/constants/message.constant';
import { UserRole } from 'src/users/types/user-role.type';
//   import { IsValidNameConstraint } from 'src/util/decorators/is-valid-name-constraint';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  userId: number;

  /**
   * 닉네임
   * @example"타로"
   */
  @IsNotEmpty({ message: MESSAGES.AUTH.COMMON.NAME.REQUIRED })
  @IsString()
  @Column()
  nickName: string;

  /**
   * 이메일
   * @example "example@example.com"
   */
  @IsNotEmpty({ message: MESSAGES.AUTH.COMMON.EMAIL.REQUIRED })
  @IsEmail({}, { message: MESSAGES.AUTH.COMMON.EMAIL.INVALID_FORMAT })
  @Column({ unique: true })
  email: string;

  /**
   * 비밀번호
   * @example "Example1!"
   */
  @IsOptional()
  @IsStrongPassword(
    { minLength: 8 },
    {
      message: MESSAGES.AUTH.COMMON.PASSWORD.INVALID_FORMAT,
    },
  )
  @Column({ select: false, nullable: true })
  password?: string;

  @IsEnum(UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
