const express= require('express');
const  path = require('path');
const bodyParser=require('body-parser');
const mysql =require('mysql');
const bcrypt =require('bcryptjs');
const ejs=require('ejs');
let app=express();

//配置中间件
app.use(bodyParser.urlencoded({extend:true}));
app.engine('.html',ejs.__express);
app.set('view engine','html');

//创建数据库连接池
let pool=mysql.createPool({
    // connectionlimit:10;
    user:'root'
});
app.get('/test',(req,res)=>{
    res.render('test',{name:'gogogo...'})
});
//主页
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname+'/views/default.html'));
})
//登录
app.get('/sign-in',(req,res)=>{
     // res.sendFile(path.join(__dirname+'/views/sign-in.html'));
    res.render('sign-in',{message:null})
});
//注册
app.get('/sign-up',(req,res)=>{
    // res.sendFile(path.join(__dirname+'/views/sign-up.html'))
    res.render('sign-up',{message:null})
});
app.post('/signUp',(req,res)=>{
    let uname=req.body.uname;
    let upwd=req.body.upwd;
    let salt = bcrypt.genSaltSync(10);  //随机盐   加盐处理
    let encryptedPassword = bcrypt.hashSync(upwd,salt);
    pool.getConnection((err,connection)=>{
        let sql="SELECT * FROM blog.user WHERE username=?";
        connection.query(sql,[uname],(err,result)=>{
            if (err) throw err;
            if(result.length==1){
                res.render('sign-up',{message:'username is existed'})
            }else{
                pool.getConnection((err,connection)=>{
                    if(err) throw err;
                    connection.query('INSERT INTO blog.user VALUES(NULL,?,?,NULL)',[uname,encryptedPassword],
                        (err,result,fields)=>{
                        if(err) throw err;
                        if(result.affectedRows==1){
                            // res.sendFile(path.join(__dirname+'/views/sign-in.html'));
                                res.render('sign-in',{message:'sign up success,sign in please'});
                        }else{
                            res.sendFile(path.join(__dirname+'/views/sign-up.html'));
                        }
                        connection.release();
                    });
                });
            }
        })
    })

});
app.post('/signIn',(req,res)=>{
    let uname=req.body.uname;
    let upwd=req.body.upwd;

    pool.getConnection((err,connection)=>{
        if(err) throw err;
        connection.query('SELECT * FROM blog.user WHERE username=?',[uname],(err,result,fields)=>{
            if(err) throw err;
            if(result.length==1){
                let encryptedPassword=result[0].password;
                if(bcrypt.compareSync(upwd,encryptedPassword)){
                    console.log("登录成功");
                    res.sendFile(path.join(__dirname+'/views/index.html'));
                }else{
                    console.log("用户名或者密码错误");
                    res.render('sign-in',{message:'Invalid username or password!'});
                }
            }else{
                res.render('sign-in',{message:'Invalid username or password!'});
            }

            connection.release();
        });
    });

});

app.listen(80);