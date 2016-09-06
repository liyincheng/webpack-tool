# version-control-replace-html
一个根据source-map，把html里面的js/css路径换成带版本号的脚本

usage: 
    node replaceJSPVersion.js --sourceMap="./source-map.json" --outputDir="./output" --pathPrefix="//cnd.mycdn.com"
    --input="../jsp/"

参数说明:

    sourceMap: webpack生成的sourceMap文件，该文件有对应模块的css/js路径
    
    outputDir: jsp的输出目录
    
    pathPrefix: js/css的路径前缀
    
    input: 输入，可以是一个jsp文件或目录
    
