import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { collaboratorUpdateType } from '../enums/collaborator-update-type.enum';

export class UpdateCollaboratorDto {
  @ApiProperty({
    description: 'Collection id of where collaborator has to be added',
  })
  @IsNotEmpty()
  collecionId: string;

  @ApiProperty({
    description: 'Update type telling whether to add or remove collaborator',
  })
  @IsNotEmpty()
  updateType: collaboratorUpdateType.ADD | collaboratorUpdateType.REMOVE;

  @ApiProperty({
    description: 'Number of items per page',
  })
  @IsNotEmpty()
  @IsOptional()
  collaboratorWalletId: string;
}
