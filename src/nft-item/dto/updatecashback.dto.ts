import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class UpdateCashbackDto {
    @ApiProperty()
    @IsString()
    itemID: string;

    @ApiProperty()
    @IsNumber()
    cashback: number;
}