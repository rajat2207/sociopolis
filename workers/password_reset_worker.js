const queue=require('../Config/kue');

const passwordResetMailer = require('../mailer/password_reset_mailer');

queue.process('password_reset_emails', function(job,done){
    console.log("Emails worker is processing a job ",job.data);

    passwordResetMailer.passwordReset(job.data);

    done();
});