import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  createVisitor(data: {
    email: string;
    name: string;
    passwordHash: string;
    verificationToken: string;
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.passwordHash,
        role: 'VISITOR',
        verificationToken: data.verificationToken, 
      },
    });
  }

  findByVerificationToken(token: string) {
    return this.prisma.user.findUnique({
      where: { verificationToken: token },
    });
  }

  markAsVerified(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });
  }
}
