const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const d = require('ejs');
// const Connection = require('mysql/lib/Connection');
var urlencodeParser = bodyParser.urlencoded({extended:false});
// require('./database/db');
const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'cmss'
});


const port = 3100;
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }else{
  console.log('connected ');
  }
});
app.set('view engine', 'ejs')
// app.use(express.json());
// app.use(cookieParser());
app.get("/", (req,res) =>{
    res.send('welcome to my home page');
   
});
app.get("/myform", (req,res) =>{
    res.render('form');
});
app.post("/insert",urlencodeParser,(req,res)=>{
  // console.log(req.body);
 
  var name = req.body.name;
  var phone = req.body.phone;
  var city = req.body.city;
  // console.log(name);
  // console.log(phone);
  // console.log(city);
  var sql = `INSERT INTO student (name,phone,city) VALUES ("${name}", "${phone}}", "${city}")`;
  connection.query(sql,function(err,result){
    if (err) throw err;
    // console.log(result);
    res.render('form');  
   console.log('1 student inserted');
  });
})


app.get("/give", (req,res) =>{
    res.render('display-form');
});
app.post('/display',urlencodeParser, (req,res)=>{
  // let v1 = String(req.body.v1);
  var n = req.body.name;
  var sql2="SELECT student.student_id, student.name, GROUP_CONCAT(course.course_name SEPARATOR ',') AS records, student.phone, student.city, student_department.department_id, department.department_name FROM student JOIN student_department ON student.student_id=student_department.student_id JOIN department ON department.department_id = student_department.department_id JOIN student_course ON student_course.student_id = student.student_id JOIN course ON student_course.course_id = course.course_id GROUP BY student.student_id HAVING student.name='"+n+"'";
  connection.query(sql2,function(err,data){
    console.log(data);
      if(err) throw err;
     res.render('display',{userData:data})
    
  })
})
app.get("/display-form", (req,res) =>{
  res.render('display');
});
app.get("/checkcourse", (req,res) =>{
  res.render('course');
});
app.post('/course',urlencodeParser, (req,res)=>{
  // let v1 = String(req.body.v1);
  var y = req.body.student_id;
  var sql2="SELECT student_course.student_id,course.course_name FROM student_course JOIN course ON student_course.course_id=course.course_id WHERE studentcourse.student_id='"+y+"'";
  connection.query(sql2,function(err,resss){
    console.log(resss);
      if(err) throw err;
     res.render('course',{hello:resss})
    
  })
})
    app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
    });

  //   app.post("/form",urlencodeParser,(req,res)=>{
  //     console.log(req.body);
  //     res.render('form',{qs:req.query});
  //     var f_name = req.body.fname;
  //     var l_name = req.body.lname;
  //     var add = req.body.add;
  //     var course = req.body.agent_id;
  //     var course_id_form = 0;
  //     if(course=="maths"){
  // course_id_form = 1;
  //     }
  //     else if(course=="english"){
  //         course_id_form = 2;
  //     }
  //     else if(course=="electronics"){
  //         course_id_form = 3;
  //     }
  //     else if(course=="physics"){
  //         course_id_form = 4;
  //     }
  //     // console.log(course);
  //     var sql = `INSERT INTO students (student_name, student_phone, student_address) VALUES ("${f_name}", "${l_name}", "${add}")`;
  //     connection.query(sql);
  //     var sql3 = 'SELECT student_id FROM students WHERE student_name = ' + mysql.escape(f_name)+'&& student_phone= '+mysql.escape(l_name);
  //     connection.query(sql3, (err, data)=>{
  //         console.log(data);
  //         studentId = data[0].student_id;
  //     var sql2 =`INSERT INTO student_course (student_id, course_id) VALUES ("${studentId}", "${course_id_form}")`;
  //     connection.query(sql2);
  //     console.log(sql2);
  //       console.log('record inserted');
  //     });
  //     });