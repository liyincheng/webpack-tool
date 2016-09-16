Html模板loader

搞了个html模板loader，为了解决在js里面写html模板不方便的问题

1. 把下面这个目录拷到你工程的node_modules，等上传到npm应该就可以直接install了

2. 把webpack的配置加一个loader：


            `{
                test:/\.tpl\.html$/,
                loader: 'html-template-loader'
            }`


3. 模板文件的后缀名为.tpl.html，模板的写法有两种格式，一种是一个文件文件一个模板，另一种是一个文件有几个模板，用变量区分：
一个文件有几个模板的：

首先写一个依赖的script，带上generate属性

            `<script generate>
                        var SELECT = require("js/select");
            </script>`


下面就可以用这个用来生成select，或者是写一个function也可以：

            `<script generate>
                        function makeSelect(){
                                    return "...";
                        }    
            </script>`
            
下面就可以调这个function
如果是纯html，不需要使用js处理的，则不用写这个<script generate>

在用的时候就写一个<script>标签，别带generate，

            `<script>select.makSelect()</script>`

不同的变量用<!--%变量名%-->隔开，像上面的截图

            `<!--%email%-->
            <div></div>

            <!--%alert%-->
            <div></div>`

3. 然后就可以require这个以.tpl.html结尾的模块：

            `var tpl = require("tpl/home.tpl.html");
            $("body").append(tpl.email);`
            

4. 如果一个模块只有单个变量的，则直接写html即可，最好require返回的是一个string

single.tpl.html:

            `<div>1</div>
            <p>2</p>`

            `var tpl = require("tpl/single.tpl.html");
            console.log(tpl) //tpl是一个字符串`


