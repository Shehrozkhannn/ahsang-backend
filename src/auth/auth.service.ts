import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService
    ) { }

    async register(username: string, password: string) {
        const hashed = await bcrypt.hash(password, 10);
        const user = this.userRepo.create({ username, password: hashed });
        return this.userRepo.save(user);
    }

    async login(username: string, password: string) {
        const user = await this.userRepo.findOne({ where: { username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, username: user.username };
        return { access_token: this.jwtService.sign(payload) };
    }
}
