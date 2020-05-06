console.log('Server-side code running');

http = require("http");
const express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
const folderPath = 'C:/Users/Stéphanie/EBWP';
var nodemailer = require('nodemailer');
var formidable = require('formidable');
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
	    cb(null, 'public/scans')
	    },
	    filename: function (req, file, cb) {
		    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+ file.extention;
		    cb(null, file.fieldname + '-' + uniqueSuffix)
	    }
	});
var upload = multer({ storage : storage }).array('filetoupload',4);
var app = express();

app.use( bodyParser.json() )  // to support JSON-encoded bodies

.use(bodyParser.urlencoded({     // to support URL-encoded bodiesz
  extended: true
}));

var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: {
	    user: 'elalami.officiel@gmail.com',
	    pass: 'samfisher@123'
	  },
	  port: 465,
	  secure: true, // use TLS
	  tls: {
	    // do not fail on invalid certs
	    rejectUnauthorized: false
	  }
	});

var mailOptions = {
        from: "elalami.officiel@gmail.com",
        to: "elalami.officiel@gmail.com",
        attachments:{}
};

app.set('view engine', 'ejs');

// start the express web server listening on 8080
app.listen(8080, () => {
  console.log('listening on 8080');
});

app.use(express.static('public'));


app.get('/', (req, res, next) => {
	res.render('homepage.ejs');
})

.get('/sendEmail', (req, res ,next) => {
	res.render('sendEmail.ejs');
})

.post('/sendEmail', function (req, res, next) {
	upload(req,res,function(err) {

		mailOptions.subject= req.body.subject;
	    mailOptions.text= req.body.message;
	    mailOptions.html= req.body.message+ '<br><p>adresse Email du client</p><b><a href="#">'+req.body.clientEmail+'</a></b>';

	    const myattachments = req.files.map((file)=>{
		  return { filename: file.originalname, path: file.path };
		});
	    
	    mailOptions.attachments = myattachments;

		transporter.sendMail(mailOptions, function(error, info){
		    if (error) {
		    	console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
		setTimeout(() => {  res.redirect('/'); }, 2000);

	        if(err) {
	            return res.end("Error uploading file.");
	        }
	    });
	
    
})
	   

//routes middleware that is specific to APP

