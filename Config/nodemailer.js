const nodemailer=require('nodemailer');
const ejs=require('ejs');
const path=require('path');


let transporter=nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port:587,
    secure: false,
    auth:{
        user:'rajatraj2207',
        password:'rajat22072001'

    }
});

//setting up template for emails
let renderTemplate = (data, relativePath) =>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../Views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log("Error in rendering the template");
            }

            mailHTML= template;
        }
    )

    return mailHTML;
};

module.exports= {
    transporter: transporter,
    renderTemplate: renderTemplate
};
