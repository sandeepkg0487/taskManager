const { userModel } = require('../../model/userSchema')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { generateJWT, generateRefreshJWT } = require('./jwt');


async function registercontroll(req, res, next) {
    console.log("signup")
    const { firstname, lastname, email, password, phone } = req.body;
    console.log('req.body:', req.body);
    console.log(email, password, firstname, lastname, phone);

    try {
        // finding email already exist making email id unique
        const findemail = await userModel.findOne({ email })
        if (findemail)
            throw new Error('user already exist');
        // return res.status(400).json({error:'user already exist'})

        // passwordHashing
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        // create userModel data
        const user = new userModel({ firstname, lastname, email, password: hashedPassword, phone })
        await user.save();

        const payload = {
            userId: user._id,
            email: user.email,
        };
        const refreshTokenPayload = {
            email: user.email,
        };


        const accessToken = generateJWT(payload)
        const refreshToken = generateRefreshJWT(refreshTokenPayload)
        let token={};
        token.access=accessToken
        token.refreshToken=refreshToken
        //SEND RESPONSE
        res
            .status(200)
            .json({
                status: "success",
                message: "Resgister Successful",
                email: user.email,
                token,
            });


    } catch (err) {
        console.log(err.message);
        res.status(300).json({ err: err.message })
    }
}

const logincontroll = async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email, password)
    try {

        //FETCHING USER DATA FROM DB
        const user = await userModel.findOne({ email })
        console.log("userfind for checking:", user);

        //USERNAME VALIDATION
        if (!user) {
            return res
                .status(400)
                .send({
                    message: "Usaer name does not match",

                });
        }

        //PASSWORD VALIDATION
        const passwordmatch = await bcrypt.compare(password, user.password)
        console.log('is password match :', passwordmatch);
        if (!passwordmatch) {
            console.log('passworddoesent match');
            return res.status(400)
                .send({
                    message: "Password does not match",

                });
        }
        console.log('generating token');
        // generete tocken
        const payload = {
            userId: user._id,
            email: user.email,
        };
        const refreshTokenPayload = {
            email: user.email,
        };


        const accessToken = generateJWT(payload)
        const refreshToken = generateRefreshJWT(refreshTokenPayload)
        console.log("accessToken:", accessToken);
        //SEND RESPONSE
        res
            .status(200)
            .json({
                message: "Login Successful",
                status: 'success',
                email: user.email,
                accessToken,
                refreshToken
            });

    } catch (err) {
        console.log('error happen in login authcontroll.js'.err);
    }

}


module.exports = { registercontroll, logincontroll, };
