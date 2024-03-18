//not db related 

const nodemailer = require('nodemailer');

const transporter =  nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'lynjb1963@gmail.com',
        pass: 'ccdc zvyn jhof hqbo'
    }

})

async function sendemail(){
    constinfo = await transporter.sendMail({
        from: 'lynjb1963@gmail.com',
        to: 'lynjb1963@gmail.com',
        subject: 'omg',
        text: 'ayaya',

    });
}

module.exports = sendemail;