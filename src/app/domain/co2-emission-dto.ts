export class Co2EmissionDto {
    unit = "g/kWh";
    co2: number;
    timestamp: Date;
  
    public static fromObject(obj: any): Co2EmissionDto {
      const co2EmissionDto = new Co2EmissionDto();
      co2EmissionDto.co2 = obj.co2;
      co2EmissionDto.timestamp = obj.timestamp;
      return co2EmissionDto;
    }
  }