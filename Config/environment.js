const development={
    name:'development',
    asset_path: '/assets',
    session_cookie_key: 'blahsomething',
    db: 'SocioPolis_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port:587,
        secure: false,
        auth:{
            user:'sociopolissite@gmail.com',
            pass:'sociopolis123'
        },tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        },
    },
    google_client_id:"1001043350512-2bkr91d6cb9o0ruov90lc0oufbftdru1.apps.googleusercontent.com",
    google_client_secret:"a1ZtpTxJ10dB-Qx4aWYHW32u",
    google_callback_URL:"http://localhost:8000/users/auth/google/callback",
    jwt_secret_key:'sociopolis'
}

const production={
    name:'production'
}

module.exports= development;