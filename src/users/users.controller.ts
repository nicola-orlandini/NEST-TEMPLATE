import { Body, Controller, Patch, Param, Post, Get, Req, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { InsertCapabilityDto } from './dto/insertCapability.dto';
import { InsertCapabilityInUserDto } from './dto/insertCapabilityInUser.dto';
import { GetUserDto } from './dto/getUser.dto';
import { Role, Roles } from 'src/auth/decorators/autorization.decorator';
// import { UpdateUserDto } from './dto/updateUser.dto';
import { RequestUserDto } from './dto/requestUser.dto';
import { DeleteCapabilityDto } from './dto/deleteCapability.dto';

@Controller('user')
export class UsersController {
    constructor(private userService: UsersService) { }

    /**
     * GLOBALE
     */

    /**
     * VISUALIZZA TUTTE LE CAPABILITIES [GLOBALE]
     */
    @Get('capabilities')
    async getCapabilities() {
        return await this.userService.getCapabilities();
    }

    /**
     * CREA NUOVO PERMESSO [GLOBALE]
     */
    @Roles(Role.SuperAdmin)
    @Put('capability/:value')
    async insertCapability(@Param() insertCapabilityDto: InsertCapabilityDto) {
        return await this.userService.insertCapability(insertCapabilityDto);
    }

    /**
     * LOCALE
     */

    // INFO USER LOGGATO
    @Get('')
    async getUser(@Req() request: RequestUserDto, @Param() getUserDto: GetUserDto) {
        return await this.userService.getUser(request.user.username)
    }

    // @Patch(':id')
    // updateUser(@Body() updateUserDto: UpdateUserDto) {
    // }

    
    // CREA PERMESSO PER L'UTENTE
    @Roles(Role.Admin)
    @Put('local-capability/:value')
    async matchCapability(@Req() request: RequestUserDto, @Param() insertCapabilityInUserDto: InsertCapabilityInUserDto) {
        return await this.userService.insertCapabilityinUser(request.user.username, insertCapabilityInUserDto)
    }

    @Delete('local-capability/:value')
    async deleteCapability(@Req() request: RequestUserDto, @Param() param: DeleteCapabilityDto) {
        return await this.userService.deleteCapability(request.user.username, param.value);
    }
}