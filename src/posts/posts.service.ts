import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post) private postRepo: Repository<Post>,
        @InjectRepository(User) private userRepo: Repository<User>
    ) { }

    async paginate(page = 1) {
        const [items, total] = await this.postRepo.findAndCount({
            relations: ['author'],
            take: 5,
            skip: (page - 1) * 5,
            order: { createdAt: 'DESC' },
        });

        return { items, total };
    }

    async findById(id: number) {
        const post = await this.postRepo.findOne({
            where: { id },
            relations: ['author'],
        });
        console.log(post)
        if (!post) throw new NotFoundException();
        return post;
    }

    async create(title: string, body: string, userId: number) {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) {
            throw new Error('User not found');
        }
        const post = this.postRepo.create({ title, body, author: user });
        return this.postRepo.save(post);
    }
}
