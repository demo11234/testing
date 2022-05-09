import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
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
    description: 'Wallet id of collaborator',
  })
  @IsNotEmpty()
  collaboratorWalletId: string;
}
