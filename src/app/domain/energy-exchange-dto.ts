export class EnergyExchangeDto {
  unit = "MWh";
  exhangeSweden: number;
  exchangeGermany: number;
  exchangeNorway: number;
  timestamp: Date;

  public static fromObject(obj: any): EnergyExchangeDto {
    const energyExchangeDto = new EnergyExchangeDto();
    energyExchangeDto.exhangeSweden = obj.exhangeSweden;
    energyExchangeDto.exchangeGermany = obj.exchangeGermany;
    energyExchangeDto.exchangeNorway = obj.exchangeNorway;
    energyExchangeDto.timestamp = obj.timestamp;
    return energyExchangeDto;
  }
}
