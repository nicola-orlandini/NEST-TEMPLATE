import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlfredTraking } from './entity/alfredTraking.entity';
import { FermoPointPacchi } from './entity/fermoPointPacchi.entity';
import { Repository } from 'typeorm';
import { AlfredStatus } from './entity/alfredStatus.entity';

@Injectable()
export class TrakingService {
  constructor(
    @InjectRepository(AlfredTraking, process.env.DB_NAMESPACE_ALFRED)
    private alfredTrakingRepository: Repository<AlfredTraking>,

    @InjectRepository(FermoPointPacchi, process.env.DB_NAMESPACE_ALFRED)
    private fermoPointPacchiRepository: Repository<FermoPointPacchi>,

    @InjectRepository(AlfredStatus, process.env.DB_NAMESPACE_ALFRED)
    private alfredStatusRepository: Repository<AlfredStatus>,
  ) {}

  async getBarcode(barcode: string) {
    const pack = await this.fermoPointPacchiRepository.findOne({
      where: { barcode_pacco: barcode },
    });
    if (!pack) {
      throw new HttpException(
        `barcode ${barcode} non trovato`,
        HttpStatus.NOT_FOUND,
      );
    }
    const trakings = await this.alfredTrakingRepository.find({
      where: {
        shipment_id: pack.Id_pacchi_fermopoint,
      },
      order: {
        data_inserimento: 'DESC',
        alfred_status: 'DESC',
      },
    });
    if (Object.keys(trakings).length <= 1) {
      throw new HttpException(
        `traking ${barcode} incompleto`,
        HttpStatus.CONFLICT,
      );
    }
    const alfredStatusExclude = [
      'P2P02',
      'P2POK',
      'P2POKR',
      'P2POK2',
      'P2PNOGEST',
      'P2PNDR',
    ];
    for (const index in trakings) {
      if (alfredStatusExclude.includes(trakings[index].alfred_status)) {
        delete trakings[index];
      }
    }
    // RICONTROLLO DOPO AVER RIMOSSO I CAMPI DA ESCLUDERE
    if (Object.keys(trakings).length <= 1) {
      throw new HttpException(
        `traking ${barcode} incompleto`,
        HttpStatus.CONFLICT,
      );
    }
    const timingLines = [];
    const status = await this.alfredStatusRepository.find({});
    for (const index in trakings) {
      if (!trakings[parseInt(index) + 1]) {
        continue;
      }
      const toStatus = status.find((item) => {
        return item.code == trakings[parseInt(index)].alfred_status;
      }).it;
      const fromStatus = status.find((item) => {
        return item.code == trakings[parseInt(index) + 1].alfred_status;
      }).it;
      trakings[parseInt(index)].alfred_status;
      const dateFrom: any = trakings[parseInt(index)].data_inserimento;
      const dateTo: any = trakings[parseInt(index) + 1].data_inserimento;
      const differenzaInMillisecondi = dateFrom - dateTo;
      const diffParse = this.msToTime(differenzaInMillisecondi);
      timingLines.push({
        diffms: differenzaInMillisecondi,
        diffmsString: `${diffParse.days} giorni, ${diffParse.hours} ore, ${diffParse.minutes} minuti`,
        to: {
          ...trakings[parseInt(index)],
          alfred_status_string: toStatus,
        },
        from: {
          ...trakings[parseInt(index) + 1],
          alfred_status_string: fromStatus,
        },
      });
    }
    timingLines.sort((a, b) => {
      return b.diffms - a.diffms;
    });
    return timingLines;
  }

  private msToTime(ms) {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return {
      days,
      hours,
      minutes,
      seconds,
    };
  }
}
