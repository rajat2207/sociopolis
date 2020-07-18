const nodemailer=require('nodemailer');
const env=require('./environment');
const ejs=require('ejs');
const path=require('path');


let transporter=nodemailer.createTransport(env.smtp);

//setting up template for emails
let renderTemplate = (data, relativePath) =>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../Views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log("Error in rendering the template",err);
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
