const nodemailer=require('../Config/nodemailer');

//this is another way of exporting a method
exports.newComment = (comment)=>{
    console.log("Inside newComment mailer");

    nodemailer.transporter.sendMail({
        from: 'sociopolissite@gmail.com',
        to: comment.user.email,
        subject: "New Comment Published",
        body:'<h1>Yup, your comment is now published</h1>'
    },(err,info)=>{
        if(err){
            console.log("Error in sending mail:",err);
            return;
        }
        
        console.log("Mail delivered", info);
        return;
    });
}