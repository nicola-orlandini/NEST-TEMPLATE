import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlfredTraking } from './entity/alfredTraking.entity';
import { FermoPointPacchi } from './entity/fermoPointPacchi.entity';
import { TrakingController } from './traking.controller';
import { TrakingService } from './traking.service';
import { AlfredStatus } from './entity/alfredStatus.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                AlfredTraking,
                FermoPointPacchi,
                AlfredStatus
            ],
            process.env.DB_NAMESPACE_ALFRED
        )
    ],
    controllers: [
        TrakingController
    ],
    providers: [
        TrakingService
    ],
})
export class TrakingModule { }
