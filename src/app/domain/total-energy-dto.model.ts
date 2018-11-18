export class TotalEnergyDto {
    totalEnergy: number;
    unit = "MWh";
    totalGreenEnergy: number;
    totalNonGreenEnergy: number;
    timestamp: Date;
  
    public static fromObject(obj: any): TotalEnergyDto {
      const totalEnergyDto = new TotalEnergyDto();
      totalEnergyDto.totalEnergy = obj.totalEnergy;
      totalEnergyDto.unit = obj.unit;
      totalEnergyDto.totalGreenEnergy = obj.totalGreenEnergy;
      totalEnergyDto.totalNonGreenEnergy = obj.totalNonGreenEnergy;
      totalEnergyDto.timestamp = obj.timestamp;
      return totalEnergyDto;
    }
  }