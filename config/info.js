// module.exports={
//     MONGOURI:'mongodb+srv://Dhaas:Dha%40s123@cluster0.iqrrzh1.mongodb.net/?retryWrites=true&w=majority',
//     JWT_SECRET:'qwertyuioplkjhgfdsazxcvbnm'
// }

if(process.env.NODE_ENV === 'production') {
    module.exports = require('./prod')
} else {
    module.exports = require('./dev')
}