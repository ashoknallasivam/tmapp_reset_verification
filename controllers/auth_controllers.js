import {Client,Account,ID,Functions} from "appwrite"

const client = new Client()
.setEndpoint('https://syd.cloud.appwrite.io/v1') // Your API Endpoint
.setProject('689ef7e2000138ab2b08')              // Your project ID

const account = new Account(client);

// complete verification for the client
export const updateVerification = async (userId, secret) => {
    try{
       const response=await account.updateVerification(userId, secret);
         console.log(response); // Success
            return response;
    }
    catch(error){
        console.log(error); // Failure
        throw error;
    }
}

// update and reset the password
export const updateNewPassword = async (userId, secret, password,password_confirm) => {
    try {
        const response = await account.updateRecovery(userId, secret, password,password_confirm);
        console.log(response); // Success
        return response;
    } catch (error) {
        console.log(error); // Failure
        throw error;
    }
};