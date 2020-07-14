const queue=require('../Config/kue');

const commentsMailer = require('../mailer/comments_mailer');

queue.process('comment_emails', function(job,done){
    console.log("Emails worker is processing a job ",job.data);

    commentsMailer.newComment(job.data);

    done();
});