const nodemailer=require('../Config/nodemailer');

//this is another way of exporting a method
exports.newComment = (comment)=>{

    let htmlString=nodemailer.renderTemplate({comment: comment},'/comment/new_comment.ejs');

    console.log("Inside newComment mailer");

    nodemailer.transporter.sendMail({
        from: '"SocioPolis" sociopolissite@gmail.com',
        to: comment.user.email,
        subject: "New Comment Published",
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