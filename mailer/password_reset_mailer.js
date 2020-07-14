const nodemailer=require('../Config/nodemailer');

//this is another way of exporting a method
exports.passwordReset = (token)=>{

    let htmlString=nodemailer.renderTemplate({token: token},'/users/password_reset.ejs');

    console.log("Inside passwordReset mailer");

    nodemailer.transporter.sendMail({
        from: '"SocioPolis" sociopolissite@gmail.com',
        to: token.user.email,
        subject: "Password Reset",
        html: htmlString
    },(err,info)=>{
        if(err){
            console.log("Error in sending mail:",err);
            return;
        }
        
        console.log("Mail delivered", info);
        return;
    });
}