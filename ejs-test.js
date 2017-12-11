const ejs=require('ejs');

console.log(require('ejs').render('Hello,<%= name%>',{name:'EJS!'}));