export class ResourceEnergyDto {
  unit = "MWh";
  powerPlants: number;
  seamills: number;
  landmills: number;
  solarCells: number;
  timestamp: Date;

  public static fromObject(obj: any): ResourceEnergyDto {
    const resourceEnergyDto = new ResourceEnergyDto();
    resourceEnergyDto.unit = obj.unit;
    resourceEnergyDto.powerPlants = obj.powerPlants;
    resourceEnergyDto.seamills = obj.seamills;
    resourceEnergyDto.landmills = obj.landmills;
    resourceEnergyDto.solarCells = obj.solarCells;
    resourceEnergyDto.timestamp = obj.timestamp;
    return resourceEnergyDto;
  }
}
