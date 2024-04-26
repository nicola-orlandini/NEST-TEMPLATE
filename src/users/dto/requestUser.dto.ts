import { IsNotEmpty, IsObject, IsString } from 'class-validator';

class UserDto {
    @IsString()
    @IsNotEmpty()
    username: string
}

export class RequestUserDto {
    @IsObject()
    @IsNotEmpty()
    user: UserDto;
}

