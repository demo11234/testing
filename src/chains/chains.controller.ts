import { Body, Controller, Get, Patch, Post, Request, Response, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Constants } from 'shared/Constants';
import { ResponseMessage } from 'shared/ResponseMessage';
import { ResponseStatusCode } from 'shared/ResponseStatusCode';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseModel } from 'src/responseModel';
import { ChainsService } from './chains.service';
import { CreateChainsDto } from './dto/create-chains.dto';
import { UpdateChainsDto } from './dto/update-chains.dto';

@Controller('chains')
export class ChainsController {
    constructor(
        private readonly chainsService: ChainsService,
        private readonly responseModel: ResponseModel,
        private readonly authService: AuthService
    ) {}

    /**
     * @description createChain will create the chain
     * @param createChainsDto
     * @returns it will return created chain details
     * @author Jeetanshu Srivastava
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiTags('Chains')
    @ApiOperation({
      summary:
        'Create new Chains',
    })
    @ApiResponse({
      status: ResponseStatusCode.CREATED,
      description: ResponseMessage.CHAIN_DETAILS,
    })
    @ApiResponse({
      status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
      description: ResponseMessage.INTERNAL_SERVER_ERROR,
    })
    @ApiBearerAuth()
    async createChain(@Body() createChainsDto: CreateChainsDto, @Response() response) : Promise<any> {
        await this.authService.checkAdmin(Constants.ADMIN);
        try {
            const chains = await this.chainsService.createChain(createChainsDto);
            return this.responseModel.response(
                chains,
                ResponseStatusCode.CREATED,
                true,
                response
            );
        } catch (error) {
            return this.responseModel.response(
                error,
                ResponseStatusCode.INTERNAL_SERVER_ERROR,
                false,
                response,
            );
        }
    }

    /**
     * @description updateChain will update a particular chain
     * @param updateChainsDto
     * @returns it will return updated chain details
     * @author Jeetanshu Srivastava
     */
    @Patch()
    @UseGuards(JwtAuthGuard)
    @ApiTags('Chains')
    @ApiOperation({
      summary:
        'Update the Existing Chains',
    })
    @ApiResponse({
      status: ResponseStatusCode.OK,
      description: ResponseMessage.CHAIN_DETAILS,
    })
    @ApiResponse({
      status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
      description: ResponseMessage.INTERNAL_SERVER_ERROR,
    })
    @ApiBearerAuth()
    async updateChain(@Body() updateChainsDto: UpdateChainsDto, @Response() response) : Promise<any> {
        await this.authService.checkAdmin(Constants.ADMIN);
        try {
            const chains = await this.chainsService.createChain(updateChainsDto);
            return this.responseModel.response(
                chains,
                ResponseStatusCode.OK,
                true,
                response
            );
        } catch (error) {
            return this.responseModel.response(
                error,
                ResponseStatusCode.INTERNAL_SERVER_ERROR,
                false,
                response,
            );            
        }
    }

    /**
     * @description getChainsForAdmin will return the details of all chains for admin
     * @returns it will return details of all chains
     * @author Jeetanshu Srivastava
     */
    @Get('/admin')
    @UseGuards(JwtAuthGuard)
    @ApiTags('Chains')
    @ApiOperation({
      summary:
        'Get all the Chain and their details',
    })
    @ApiResponse({
      status: ResponseStatusCode.OK,
      description: ResponseMessage.CHAIN_DETAILS,
    })
    @ApiResponse({
      status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
      description: ResponseMessage.INTERNAL_SERVER_ERROR,
    })
    @ApiBearerAuth()
    async getChainsForAdmin(@Response() response, @Request() request) : Promise<any> {
        await this.authService.checkAdmin(request.user.data);
        try {
            const chains = await this.chainsService.getChainsForAdmin();
            return this.responseModel.response(
                chains,
                ResponseStatusCode.OK,
                true,
                response
            );            
        } catch (error) {
            console.log(error);
            return this.responseModel.response(
                error,
                ResponseStatusCode.INTERNAL_SERVER_ERROR,
                false,
                response,
            );
        }
    }

    /**
     * @description getChainsForUser will return the details of all chains for user
     * @returns it will return details of all chains
     * @author Jeetanshu Srivastava
     */
    @Get('/user')
    @UseGuards(JwtAuthGuard)
    @ApiTags('Chains')
    @ApiOperation({
      summary:
        'Get all the chains and their details',
    })
    @ApiResponse({
      status: ResponseStatusCode.OK,
      description: ResponseMessage.CHAIN_DETAILS,
    })
    @ApiResponse({
      status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
      description: ResponseMessage.INTERNAL_SERVER_ERROR,
    })
    @ApiBearerAuth()
    async getChainsForUser(@Response() response, @Request() request) : Promise<any> {
        await this.authService.checkUser(request.user.data, request.user.walletAddress);
        try {
            const chains = await this.chainsService.getChainsForUser();
            return this.responseModel.response(
                chains,
                ResponseStatusCode.OK,
                true,
                response
            );
        } catch (error) {
            return this.responseModel.response(
                error,
                ResponseStatusCode.INTERNAL_SERVER_ERROR,
                false,
                response,
            );
        }
    }
}
