const { CognitoJwtVerifier } = require("aws-jwt-verify");

const COGNITO_USERPOOL_ID = process.env.COGNITO_USERPOOL_ID;
const COGNITO_WEB_CLIENT_ID = process.env.COGNITO_WEB_CLIENT_ID;

const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO_USERPOOL_ID,
    tokenUse: "id",
    clientId: COGNITO_WEB_CLIENT_ID
})

const generatepolicy = (principalId, effect, resource) => {
    var authResponse = {};
    authResponse.principalId = principalId;

    if(effect && resource) {
        let policyDocument = {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: effect,
                    Resource: resource,
                    Action: "execute-api:Invoke",
                },
            ],
        };
        authResponse.policyDocument = policyDocument;
    }
    authResponse.context = {
        foo: "bar",
    };
    console.log(JSON.stringify(authResponse));
    return authResponse;
}

exports.handler = async (event, context, callback) => {
 //lambda authorizer code
 var token = event.authorizationToken;
 console.log(token);

 try{
    const payload = await jwtVerifier.verify(token);
    console.log(JSON.stringify(payload));
    callback(null, generatepolicy("user", "Allow", event.methodArn));
 }catch(err){
    callback("Error: Invalid token");
 }
//  var token = event.authorizationToken; // "allow" or "deny"
//  switch (token) {
//     case "allow":
//         callback(null, generatepolicy("user", "Allow", event.methodArn));
//         break;
//     case "deny":
//         callback(null, generatepolicy("user", "Deny", event.methodArn));
//         break;
//     default:
//         callback("Error; Invalid token");    
//  }
};