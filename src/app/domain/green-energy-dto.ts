export class GreenEnergyDto {
  unit = "MWh";
  totalGreenEnergy: number;
  ratioOfTotalEnergy: number;
  timestamp: Date;

  public static fromObject(obj: any): GreenEnergyDto {
    const greenEnergyDto = new GreenEnergyDto();
    greenEnergyDto.unit = obj.unit;
    greenEnergyDto.totalGreenEnergy = obj.totalGreenEnergy;
    greenEnergyDto.ratioOfTotalEnergy = obj.ratioOfTotalEnergy;
    greenEnergyDto.timestamp = obj.timestamp;
    return greenEnergyDto;
  }
}
