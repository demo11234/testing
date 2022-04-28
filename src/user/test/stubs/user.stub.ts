import { s3Folder } from "../../../../src/user/enum/s3-filepath.enum"

export const createUserStub = () => {
    return {
        walletAddress : "1213e32423243"
    }
}

export const createUserReturnStub = () => {
    return { 
        message: {
            message: { access_token: 'abcefgh', success: true },
            status: 200,
            success: true,
            access_token: 'abcdefgh'
        },
        status: 200,
        success: true
    }
}

export const getUserDetailsByUserNameStub = () => {
    return {
        userName: "string"
    }
}

export const getUserDetailsByUseNameServiceStub = () => {
    return "string"
}

export const getUserDetailsByUserNameReturnStub = () => {
    return {
        message: {
            walletAdress: 'string'
        },
        status: 200,
        success: true
    }
}

export const getUserDetailsByWalletAddressStub = () => {
    return {
        walletAddress: "1213e32423243"
    }
}

export const getUserByWalletAddressReturnStub = () => {
    return {
        message: {
            message: { access_token: 'abcefgh', success: true },
            status: 200,
            success: true,
        },
        status: 200,
        success: true
    }
}

export const getPresignedURLStub = () => {
    return {
        fileName: "fileName", fileType: "fileType", filePath: s3Folder.PROFILE
    }
}

export const getPresignedURLReturnStub = () => {
    return {
        success: true
    }
}